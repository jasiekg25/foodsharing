# manage.py


import sys
import csv
from dateutil import parser


from flask.cli import FlaskGroup

from app import create_app, db
from app.api.models_old import User

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('reset_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("database reset done!")


# load sample quote data
@cli.command('load_data')
def load_data():

    # load user table
    db.session.add(User(username='test', email="test@test.com", password="test"))
    db.session.add(User(username='lebronjames', email="ljames@nba.com", password="mypassword"))
    db.session.add(User(username='stephencurry', email="stephencurry@nba.com", password="mypassword"))
    print("user table loaded")

    db.session.commit()

if __name__ == '__main__':
    cli()
