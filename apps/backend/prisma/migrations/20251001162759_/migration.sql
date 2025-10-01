-- CreateIndex
CREATE INDEX "products_status_idx" ON "public"."products"("status");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "public"."products"("category");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "public"."products"("name");

-- CreateIndex
CREATE INDEX "sale_items_saleId_idx" ON "public"."sale_items"("saleId");

-- CreateIndex
CREATE INDEX "sale_items_productId_idx" ON "public"."sale_items"("productId");

-- CreateIndex
CREATE INDEX "sales_uapId_idx" ON "public"."sales"("uapId");

-- CreateIndex
CREATE INDEX "sales_status_idx" ON "public"."sales"("status");

-- CreateIndex
CREATE INDEX "sales_createdAt_status_idx" ON "public"."sales"("createdAt", "status");

-- CreateIndex
CREATE INDEX "uaps_name_idx" ON "public"."uaps"("name");

-- CreateIndex
CREATE INDEX "uaps_location_idx" ON "public"."uaps"("location");
