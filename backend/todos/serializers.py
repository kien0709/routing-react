from rest_framework import serializers

from authentication.models import FirebaseUser
from authentication.serializers import UserOptionSerializer

from .models import TodoItem, TodoList


# zet een taak om naar json met de gegevens van de toegewezen gebruiker erbij
class TodoItemSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=FirebaseUser.objects.all(),
        allow_null=True,
        required=False,
    )
    assigned_to_detail = UserOptionSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = TodoItem
        fields = ['id', 'todo_list', 'title', 'completed', 'assigned_to', 'assigned_to_detail', 'created_at', 'updated_at']
        read_only_fields = ['todo_list']


# zet een lijst om naar json met de eigenaar en hoeveel taken er zijn en hoeveel klaar
# de taken zelf worden apart en per pagina opgehaald via todolists id items
class TodoListSerializer(serializers.ModelSerializer):
    owner = UserOptionSerializer(read_only=True)
    item_count = serializers.SerializerMethodField()
    done_count = serializers.SerializerMethodField()

    class Meta:
        model = TodoList
        fields = ['id', 'title', 'owner', 'item_count', 'done_count', 'created_at', 'updated_at']

    # de views tellen dit al in de query met annotate anders tellen we het hier
    def get_item_count(self, obj):
        count = getattr(obj, 'item_count', None)
        return count if count is not None else obj.items.count()

    def get_done_count(self, obj):
        count = getattr(obj, 'done_count', None)
        return count if count is not None else obj.items.filter(completed=True).count()
