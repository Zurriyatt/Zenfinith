from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.productList, name='product-list'),
    path('recommendations/<uuid:product_id>/', views.recommend_products, name='recommendations'),
]