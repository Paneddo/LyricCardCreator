from flask import Flask


def create_app():
    app = Flask(__name__)
    from .src import main as main_blueprint
    from .src.config import ApplicationConfig

    app.config.from_object(ApplicationConfig)
    app.register_blueprint(main_blueprint)

    return app
