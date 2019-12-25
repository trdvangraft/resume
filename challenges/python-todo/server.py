from flask_restplus import Resource, Api, abort
from flask import Flask, request, jsonify, render_template, url_for
from flask_mongoalchemy import MongoAlchemy, BaseQuery

def create_app():
    app = Flask(__name__, template_folder="templates")
    app.config["DEBUG"] = True
    app.config["MONGOALCHEMY_DATABASE"] = 'library'
    return app

app = create_app()
db = MongoAlchemy(app)
api = Api(app)

todos = [
    {
        'id': '1',
        'title': 'Buy groceries',
        'description': 'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': '2',
        'title': 'Learn Python',
        'description': 'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@api.route('/v1/todo')
@api.route('/v1/todo/<string:todo_id>')
class Todo(Resource):
    def get(self, todo_id = None):
        if todo_id == None:
            return todos
        matched_todos = [todo for todo in todos if todo['id'] == todo_id]
        if len(matched_todos) == 0:
            abort(404, 'Todo was not found')
        return jsonify({ 'todo': matched_todos[0] })

if __name__ == '__main__':
    app.run()