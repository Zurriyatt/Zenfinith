from django.http import JsonResponse
from .models import Product


def productList(request):
    products = Product.objects.all().values()
    return JsonResponse(list(products), safe=False)

def recommend_products(request, product_id):
    try:
        current = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    # Get similar products: same category, price within +/-20%, exclude current, order by rating
    price_min = float(current.price) * 0.8
    price_max = float(current.price) * 1.2

    recommendations = Product.objects.filter(
        category=current.category,
        price__gte=price_min,
        price__lte=price_max
    ).exclude(id=product_id).order_by('-rating')[:5]

    data = [
        {
            "id": p.id,
            "name": p.name,
            "price": float(p.price),
            "description": p.description,
            "images": p.images,
            "category": p.category,
            "rating": p.rating,
            "badge": p.badge,
        }
        for p in recommendations
    ]

    return JsonResponse(data, safe=False)