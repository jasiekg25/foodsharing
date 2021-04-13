from app import db

offers_tags = db.Table("offers_tags",
                       db.Column('offer_id', db.Integer, db.ForeignKey('offer.id'), nullable=False),
                       db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), nullable=False))

# class OfferTag(db.Model):
#     __tablename__ = "offer_tag"
#
#     id = db.Column(db.Integer, primary_key=True)
#     offer_id =   # Many offerTags to one offer
#     tag_id = db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), nullable=False)  # Many offerTags to one offer


class Tag(db.Model):
    __tablename__ = "tag"

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column('tag_name', db.String(255), nullable=False)
    wanted = db.Column('wanted', db.Boolean, nullable=False)

    offers = db.relationship('Offer', back_populates='tags', secondary=offers_tags)  # one tag to many OfferTags