from flask_restplus import Resource, Api, abort, fields
from flask import Flask, request, jsonify, render_template, url_for
from marshmallow import Schema, fields, ValidationError
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

def create_app():
    app = Flask(__name__, template_folder="templates")
    app.config["DEBUG"] = True
    app.config["MONGO_URI"] = 'mongodb://localhost:27017/todo_python'
    return app

app = create_app()
mongo = PyMongo(app)
api = Api(app)

### Schemas ###
class TodoSchema(Schema):
    _id = fields.Str()
    title = fields.Str()
    description = fields.Str()
    done = fields.Str()

todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

@api.route('/v1/todo', methods = ["GET", "POST"])
@api.route('/v1/todo/<string:todo_id>', methods = ["GET", "PUT"])
class Todo(Resource):
    def get(self, todo_id=None):
        print(todo_id)
        col = mongo.db.todo_schema
        if todo_id == None:
            return todos_schema.dump(col.find())
        return todos_schema.dump(col.find({ "_id": ObjectId(todo_id)}))
    
    def post(self):
        col = mongo.db.todo_schema
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400
        try:
            data = todo_schema.load(json_data)
        except ValidationError as err:
            return err, 422
        new_todo_id = col.insert_one(data).inserted_id
        return todos_schema.dump(col.find({ "_id": ObjectId(new_todo_id) }))
    
    def put(self, todo_id):
        col = mongo.db.todo_schema
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400
        try:
            data = todo_schema.load(json_data)
        except ValidationError as err:
            return err, 422
        col.update_one({ "_id": ObjectId(todo_id) }, { "$set": data })
        return todos_schema.dump(col.find({"_id": ObjectId(todo_id)}))
    
    def delete(self, todo_id):
        col = mongo.db.todo_schema
        if todo_id == None:
            return {"message": "No input data provided"}, 400
        

if __name__ == '__main__':
    app.run()