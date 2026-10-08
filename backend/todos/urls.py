from django.urls import path

from . import views

# alle todo endpoints ze komen onder api
urlpatterns = [
    path('todolists/', views.TodoListListCreateView.as_view(), name='todolist-list-create'),
    path('todolists/<uuid:pk>/', views.TodoListDetailView.as_view(), name='todolist-detail'),
    path('todolists/<uuid:todo_list_pk>/items/', views.TodoItemListCreateView.as_view(), name='todoitem-list-create'),
    path('todoitems/<uuid:pk>/', views.TodoItemDetailView.as_view(), name='todoitem-detail'),
    path('todostats/', views.TodoStatsView.as_view(), name='todo-stats'),
]
