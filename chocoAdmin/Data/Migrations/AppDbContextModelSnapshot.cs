﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using choco.Data;

#nullable disable

namespace choco.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("choco.Data.Models.MovingItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<double>("Amount")
                        .HasColumnType("double precision");

                    b.Property<Guid?>("OrderId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ProductId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("ShipmentId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("OrderId");

                    b.HasIndex("ProductId");

                    b.HasIndex("ShipmentId");

                    b.ToTable("MovingItems");
                });

            modelBuilder.Entity("choco.Data.Models.Order", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AddressId")
                        .HasColumnType("uuid");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean");

                    b.Property<Guid>("StatusId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("AddressId");

                    b.HasIndex("StatusId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("choco.Data.Models.OrderAddress", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Building")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("CityId")
                        .HasColumnType("uuid");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CityId");

                    b.ToTable("OrderAddresses");
                });

            modelBuilder.Entity("choco.Data.Models.OrderCity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("OrderCities");

                    b.HasData(
                        new
                        {
                            Id = new Guid("ff463388-158c-48ab-98c2-6b798ceda4ed"),
                            Name = "Владимир"
                        },
                        new
                        {
                            Id = new Guid("121ed4ac-8fd9-4a2f-b88e-80129fbbc824"),
                            Name = "Фурманов"
                        });
                });

            modelBuilder.Entity("choco.Data.Models.OrderStatus", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("OrderStatuses");

                    b.HasData(
                        new
                        {
                            Id = new Guid("3e2a576c-740a-4d81-8e9a-6fa7136d96d9"),
                            Name = "Обрабатывается"
                        },
                        new
                        {
                            Id = new Guid("a632e467-59ba-48db-9f26-88ccb3ee31d9"),
                            Name = "Доставляется"
                        },
                        new
                        {
                            Id = new Guid("41e7f82c-d17c-4c5f-9c0d-5d5903e6b257"),
                            Name = "Выполнен"
                        },
                        new
                        {
                            Id = new Guid("110dd7cd-6c6b-4404-bb63-7dcf70a3c2db"),
                            Name = "Отменён"
                        });
                });

            modelBuilder.Entity("choco.Data.Models.Product", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CategoryId")
                        .HasColumnType("uuid");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsByWeight")
                        .HasColumnType("boolean");

                    b.Property<double>("Leftover")
                        .HasColumnType("double precision");

                    b.Property<int>("MarketId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RetailPrice")
                        .HasColumnType("integer");

                    b.Property<int>("WholesalePrice")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("choco.Data.Models.ProductCategory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ProductCategories");
                });

            modelBuilder.Entity("choco.Data.Models.Shipment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean");

                    b.Property<Guid>("StatusId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("StatusId");

                    b.ToTable("Shipments");
                });

            modelBuilder.Entity("choco.Data.Models.ShipmentStatus", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ShipmentStatuses");

                    b.HasData(
                        new
                        {
                            Id = new Guid("21ecdafc-dc56-4bb2-868f-0be776726713"),
                            Name = "Обрабатывается"
                        },
                        new
                        {
                            Id = new Guid("90786c29-b967-457f-afe6-714d92b5fffd"),
                            Name = "Доставляется"
                        },
                        new
                        {
                            Id = new Guid("9ba56286-f218-4a04-a682-9ded4613a33e"),
                            Name = "Выполнена"
                        },
                        new
                        {
                            Id = new Guid("d5c0799e-bd48-4e12-985b-502a05e72432"),
                            Name = "Отменена"
                        });
                });

            modelBuilder.Entity("choco.Data.Models.MovingItem", b =>
                {
                    b.HasOne("choco.Data.Models.Order", null)
                        .WithMany("Items")
                        .HasForeignKey("OrderId");

                    b.HasOne("choco.Data.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("choco.Data.Models.Shipment", null)
                        .WithMany("Items")
                        .HasForeignKey("ShipmentId");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("choco.Data.Models.Order", b =>
                {
                    b.HasOne("choco.Data.Models.OrderAddress", "Address")
                        .WithMany()
                        .HasForeignKey("AddressId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("choco.Data.Models.OrderStatus", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Address");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("choco.Data.Models.OrderAddress", b =>
                {
                    b.HasOne("choco.Data.Models.OrderCity", "City")
                        .WithMany()
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("City");
                });

            modelBuilder.Entity("choco.Data.Models.Product", b =>
                {
                    b.HasOne("choco.Data.Models.ProductCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");
                });

            modelBuilder.Entity("choco.Data.Models.Shipment", b =>
                {
                    b.HasOne("choco.Data.Models.ShipmentStatus", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Status");
                });

            modelBuilder.Entity("choco.Data.Models.Order", b =>
                {
                    b.Navigation("Items");
                });

            modelBuilder.Entity("choco.Data.Models.Shipment", b =>
                {
                    b.Navigation("Items");
                });
#pragma warning restore 612, 618
        }
    }
}
