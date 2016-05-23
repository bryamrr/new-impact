# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


Role.create(name: "Admin")
Role.create(name: "Supervisor")
Role.create(name: "Customer")

Item.create(name: "Movilidad")
Item.create(name: "Hielo")
Item.create(name: "Vasos")
Item.create(name: "Combustible")
Item.create(name: "Peaje")
Item.create(name: "Alojamiento")
Item.create(name: "Alimentacion")
Item.create(name: "Lavanderia")
Item.create(name: "Gastos Operativos")
Item.create(name: "Compras Operativas")
Item.create(name: "Servicios")

Voucher.create(name: "Factura")
Voucher.create(name: "Boleta")
Voucher.create(name: "Recibo por honorario")
Voucher.create(name: "Sin sustento")

QuantityType.create(name: "Producto")
QuantityType.create(name: "Merchandising")
QuantityType.create(name: "Personal")
QuantityType.create(name: "Premio")

CommentType.create(name: "Anfitriona")
CommentType.create(name: "Cliente/Representante/Punto")
CommentType.create(name: "Público")
CommentType.create(name: "Activación")
CommentType.create(name: "Generales")

ReportType.create(name: "Expense")
ReportType.create(name: "Point")

ActivityType.create(name: "Activación");
ActivityType.create(name: "Campaña");
ActivityType.create(name: "Evento");

