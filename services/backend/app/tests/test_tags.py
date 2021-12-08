import json


def test_get_tags(test_app, monkeypatch):
    client = test_app.test_client()
    resp = client.get(
        "/tags",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert len(data) > 0