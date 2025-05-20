 """
Main Flask application entry point.
"""

import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_name='dev'):
    """Create and configure the Flask application."""
    from backend.config import config_by_name
    
    # Initialize app
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
    app.config.from_object(config_by_name[config_name])
    
    # Setup extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.resumes import resumes_bp
    from backend.routes.job_applications import jobs_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(resumes_bp, url_prefix='/api/resumes')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    
    # Error handlers
    from backend.utils.errors import ValidationError, AuthError, NotFoundError
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return jsonify(error.to_dict()), 400
    
    @app.errorhandler(AuthError)
    def handle_auth_error(error):
        return jsonify(error.to_dict()), 401
    
    @app.errorhandler(NotFoundError)
    def handle_not_found_error(error):
        return jsonify(error.to_dict()), 404
    
    @app.errorhandler(500)
    def handle_server_error(error):
        return jsonify({'message': 'An internal server error occurred'}), 500
    
    # Serve React app
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

app = create_app(os.getenv('FLASK_ENV', 'dev'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)