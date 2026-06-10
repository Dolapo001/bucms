from rest_framework_simplejwt.tokens import RefreshToken

class AuthService:
    """
    Service layer containing operations related to JWT sessions and authentication.
    """
    @staticmethod
    def blacklist_token(refresh_token_str):
        """
        Blacklists a refresh token to terminate a session.
        """
        token = RefreshToken(refresh_token_str)
        token.blacklist()
        return True
