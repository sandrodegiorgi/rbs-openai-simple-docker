from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Interaction(db.Model):
    __tablename__ = 'interactions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(64), nullable=False)
    interaction_type = db.Column(db.String(256), nullable=False)
    model = db.Column(db.String(32), nullable=False)
    role = db.Column(db.String(16), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
