from django.contrib import admin

from .models import TodoItem, TodoList


# lijsten en taken zichtbaar maken in admin
@admin.register(TodoList)
class TodoListAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'created_at')


@admin.register(TodoItem)
class TodoItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'todo_list', 'assigned_to', 'completed')
    list_filter = ('completed',)
