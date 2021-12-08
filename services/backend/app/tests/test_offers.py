from datetime import datetime
import json
import pytest
from app.api.swagger.offers import Offers


def test_get_offer(test_app, monkeypatch):
    monkeypatch.setattr(
        Offers, "get_all_active_offers_except_mine", lambda _: [{"id": 1,
        "user_name": 'test_username',
        "name": 'Schabowy',
        "active": True,
        "description": '',
        "photo": None,
        "portions_number": 5,
        "used_portions": 2,
        "pickup_longitude": 50.01,
        "pickup_latitude": 28.41,
        "post_time": datetime.utcnow(),
        "pickup_times": 'wieczor',
        "tags": []}]
    )

    client = test_app.test_client()
    resp = client.get(
        "/offers",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert len(data) == 1


def test_post_empty_offer(test_app, monkeypatch):
    client = test_app.test_client()
    resp = client.get(
        "/offers",
        data=json.dumps({}),
        content_type="application/json",
    )
    assert resp.status_code == 400


def test_post_empty_offer(test_app, monkeypatch):
    client = test_app.test_client()
    monkeypatch.setattr(Offers, 'add_offer', lambda _: 1)
    resp = client.get(
        "/offers",
        data=json.dumps({'name': 'test', 'portions_number': 4, 'longitude': 50.00, 'latitude': 50.00, 'pickup_times': 'wieczor', 'offer_expiry': datetime.utcnow()}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 201
    assert "Offer has been added" == data['message']