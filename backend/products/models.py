from django.db import models

class Product(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.TextField()
    price = models.FloatField()
    oldprice = models.FloatField(db_column='oldPrice', blank=True, null=True)
    description = models.TextField()
    images = models.TextField(blank=True, null=True)
    category = models.TextField()
    rating = models.FloatField(blank=True, null=True)
    reviewscount = models.IntegerField(db_column='reviewsCount', blank=True, null=True)
    createdat = models.DateTimeField(db_column='createdAt')
    badge = models.TextField()
    totaldiscount = models.FloatField(db_column='totalDiscount')

    class Meta:
        managed = False
        db_table = 'Product'