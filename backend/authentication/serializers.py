from firebase_admin import auth as firebase_auth
from rest_framework import serializers

from .firebase import initialize_firebase
from .models import FirebaseUser


# zet een gebruiker om naar json en terug voor admins met rol en wachtwoord
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=False)

    class Meta:
        model = FirebaseUser
        fields = ['id', 'email', 'display_name', 'photo_url', 'role', 'password', 'created_at']
        read_only_fields = ['photo_url', 'created_at']
        extra_kwargs = {'email': {'required': True, 'allow_blank': False}}

    # bij aanmaken is een wachtwoord verplicht bij bewerken niet
    def validate(self, attrs):
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError({'password': 'Wachtwoord is verplicht.'})
        return attrs

    # maakt eerst het account in firebase aan en daarna de gebruiker in onze database
    def create(self, validated_data):
        password = validated_data.pop('password')

        initialize_firebase()
        try:
            firebase_user = firebase_auth.create_user(
                email=validated_data['email'],
                password=password,
                display_name=validated_data.get('display_name') or None,
            )
        except firebase_auth.EmailAlreadyExistsError:
            raise serializers.ValidationError({'email': 'Dit emailadres is al geregistreerd.'})

        return FirebaseUser.objects.create(firebase_uid=firebase_user.uid, **validated_data)

    # past gewijzigde email naam of wachtwoord ook in firebase aan en slaat daarna op
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        changes = {}

        if 'email' in validated_data and validated_data['email'] != instance.email:
            changes['email'] = validated_data['email']
        if 'display_name' in validated_data and validated_data['display_name'] != instance.display_name:
            changes['display_name'] = validated_data['display_name'] or None
        if password:
            changes['password'] = password

        if changes:
            initialize_firebase()
            try:
                firebase_auth.update_user(instance.firebase_uid, **changes)
            except firebase_auth.EmailAlreadyExistsError:
                raise serializers.ValidationError({'email': 'Dit emailadres is al geregistreerd.'})
            except firebase_auth.UserNotFoundError:
                pass

        return super().update(instance, validated_data)


# korte versie voor het kiezen van een gebruiker bij het toewijzen van taken
class UserOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirebaseUser
        fields = ['id', 'email', 'display_name', 'photo_url']
