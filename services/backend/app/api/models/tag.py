from app import db


class OffersTags(db.Model):
    __tablename__ = "tags_offers"

    id = db.Column(db.Integer, primary_key=True)
    offer_id =  db.Column('offer_id', db.Integer, db.ForeignKey('offer.id'), nullable=False) # Many offerTags to one offer
    tag_id = db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), nullable=False)  # Many offerTags to one offer
    offer = db.relationship("Offer", back_populates="tags")
    tag = db.relationship("Tag", back_populates="offers")


    @staticmethod
    def add_offer_tag(offer_id, tag_id):
        offer_tag = OffersTags(
            offer_id = offer_id,
            tag_id = tag_id
        )
        db.session.add(offer_tag)
        db.session.commit()




class Tag(db.Model):
    __tablename__ = "tag"

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column('tag_name', db.String(255), nullable=False)
    is_wanted = db.Column('is_wanted', db.Boolean, nullable=False)

    offers = db.relationship('OffersTags', back_populates='tag')

    def to_dict(self):
        data = {
            'tag_id': self.id,
            'tag_name': self.tag_name,
        }
        return data


    @staticmethod
    def get_all_tags():
        return Tag.query.all()

