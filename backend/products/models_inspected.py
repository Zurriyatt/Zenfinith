DB_URL is: postgresql://neondb_owner:npg_q3QO4gAPXFoJ@ep-bold-dawn-ay3k773m-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Product(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.TextField()
    price = models.FloatField()
    oldprice = models.FloatField(db_column='oldPrice', blank=True, null=True)  # Field name made lowercase.
    description = models.TextField()
    images = models.TextField(blank=True, null=True)  # This field type is a guess.
    category = models.TextField()
    rating = models.FloatField(blank=True, null=True)
    reviewscount = models.IntegerField(db_column='reviewsCount', blank=True, null=True)  # Field name made lowercase.
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.
    badge = models.TextField()
    totaldiscount = models.FloatField(db_column='totalDiscount')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Product'


class Twofa(models.Model):
    email = models.TextField(primary_key=True)
    otp = models.IntegerField()
    attempts = models.IntegerField()
    expiresat = models.DateTimeField(db_column='expiresAt')  # Field name made lowercase.
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'TwoFA'


class PrismaMigrations(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    checksum = models.CharField(max_length=64)
    finished_at = models.DateTimeField(blank=True, null=True)
    migration_name = models.CharField(max_length=255)
    logs = models.TextField(blank=True, null=True)
    rolled_back_at = models.DateTimeField(blank=True, null=True)
    started_at = models.DateTimeField()
    applied_steps_count = models.IntegerField()

    class Meta:
        managed = False
        db_table = '_prisma_migrations'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Cart(models.Model):
    id = models.UUIDField(primary_key=True)
    userid = models.ForeignKey('Users', models.DB_CASCADE, db_column='userId')  # Field name made lowercase.
    productid = models.ForeignKey(Product, models.DB_CASCADE, db_column='productId')  # Field name made lowercase.
    quantity = models.IntegerField()
    addedat = models.DateTimeField(db_column='addedAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'cart'
        unique_together = (('userid', 'productid'),)


class Coupons(models.Model):
    id = models.UUIDField(primary_key=True)
    code = models.TextField(unique=True)
    type = models.TextField()  # This field type is a guess.
    value = models.FloatField()
    minordervalue = models.FloatField(db_column='minOrderValue', blank=True, null=True)  # Field name made lowercase.
    maxdiscount = models.FloatField(db_column='maxDiscount', blank=True, null=True)  # Field name made lowercase.
    validfrom = models.DateTimeField(db_column='validFrom', blank=True, null=True)  # Field name made lowercase.
    validuntil = models.DateTimeField(db_column='validUntil', blank=True, null=True)  # Field name made lowercase.
    usagelimit = models.IntegerField(db_column='usageLimit', blank=True, null=True)  # Field name made lowercase.
    usedcount = models.IntegerField(db_column='usedCount')  # Field name made lowercase.
    isactive = models.BooleanField(db_column='isActive')  # Field name made lowercase.
    productids = models.TextField(db_column='productIds', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    createdat = models.DateTimeField(db_column='createdAt')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'coupons'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)
# Unable to inspect table 'django_migrations'
# The error was: server closed the connection unexpectedly
	This probably means the server terminated abnormally
	before or while processing the request.
server closed the connection unexpectedly
	This probably means the server terminated abnormally
	before or while processing the request.
# Unable to inspect table 'django_session'
# The error was: cursor already closed
# Unable to inspect table 'liked'
# The error was: cursor already closed
# Unable to inspect table 'order_items'
# The error was: cursor already closed
# Unable to inspect table 'orders'
# The error was: cursor already closed
# Unable to inspect table 'products_product'
# The error was: cursor already closed
# Unable to inspect table 'sessions'
# The error was: cursor already closed
# Unable to inspect table 'settings'
# The error was: cursor already closed
# Unable to inspect table 'users'
# The error was: cursor already closed
