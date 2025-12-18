const functionsData = {
  "service.CartService.ClearCart": {
    "calledFunctions": [
      "s.cartRepo.Delete"
    ],
    "comments": "ClearCart カートをクリア",
    "fileName": "application/service/cart.go",
    "fullName": "service.CartService.ClearCart",
    "functionName": "ClearCart",
    "mermaidCode": "flowchart TD\n    N1([\"`**CartService.ClearCart**`\"])\n    N2([\"return s.cartRepo.Delete(ctx, cartID)\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n    click N2 \"javascript:navigateToFunction('s.cartRepo.Delete')\"\n",
    "packageName": "service",
    "receiverType": "CartService"
  },
  "service.CartService.GetCart": {
    "calledFunctions": [
      "s.cartRepo.GetByID",
      "cart.IsEmpty"
    ],
    "comments": "GetCart カートIDでカートを取得",
    "fileName": "application/service/cart.go",
    "fullName": "service.CartService.GetCart",
    "functionName": "GetCart",
    "mermaidCode": "flowchart TD\n    N1([\"`**CartService.GetCart**`\"])\n    N2[\"cart, err := s.cartRepo.GetByID(ctx, cartID)\"]\n    N3{{\"err != nil\"}}\n    N4([\"return nil, err\"])\n    N5((\"終了\"))\n    N6[\"処理続行\"]\n    N7[\"合流点\"]\n    N8{{\"カートが空の場合はエラー\\ncart.IsEmpty()\"}}\n    N9([\"return nil, \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13([\"return cart, nil\"])\n    N14((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N13 --\u003e N14\n    N12 --\u003e N13\n    click N2 \"javascript:navigateToFunction('s.cartRepo.GetByID')\"\n    click N8 \"javascript:navigateToFunction('cart.IsEmpty')\"\n",
    "packageName": "service",
    "receiverType": "CartService"
  },
  "service.CartService.GetCartByCustomer": {
    "calledFunctions": [
      "s.cartRepo.GetByCustomerID",
      "cart.IsEmpty"
    ],
    "comments": "GetCartByCustomer 顧客IDでカートを取得",
    "fileName": "application/service/cart.go",
    "fullName": "service.CartService.GetCartByCustomer",
    "functionName": "GetCartByCustomer",
    "mermaidCode": "flowchart TD\n    N1([\"`**CartService.GetCartByCustomer**`\"])\n    N2[\"cart, err := s.cartRepo.GetByCustomerID(ctx, customerID)\"]\n    N3{{\"err != nil\"}}\n    N4([\"return nil, err\"])\n    N5((\"終了\"))\n    N6[\"処理続行\"]\n    N7[\"合流点\"]\n    N8{{\"cart.IsEmpty()\"}}\n    N9([\"return nil, \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13([\"return cart, nil\"])\n    N14((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N13 --\u003e N14\n    N12 --\u003e N13\n    click N2 \"javascript:navigateToFunction('s.cartRepo.GetByCustomerID')\"\n    click N8 \"javascript:navigateToFunction('cart.IsEmpty')\"\n",
    "packageName": "service",
    "receiverType": "CartService"
  },
  "service.CartService.ValidateCartItems": {
    "calledFunctions": [
      "s.inventoryRepo.GetStock"
    ],
    "comments": "ValidateCartItems カートアイテムの有効性を検証",
    "fileName": "application/service/cart.go",
    "fullName": "service.CartService.ValidateCartItems",
    "functionName": "ValidateCartItems",
    "mermaidCode": "flowchart TD\n    N1([\"`**CartService.ValidateCartItems**`\"])\n    N2{{\"for _, item := range cart.Items\"}}\n    N3{{\"商品が利用可能かチェック\\nitem.Product == nil\"}}\n    N4([\"return \u0026\"])\n    N5((\"終了\"))\n    N6[\"処理続行\"]\n    N7{{\"!item.Product.IsAvailable\"}}\n    N8([\"return \u0026\"])\n    N9((\"終了\"))\n    N10[\"処理続行\"]\n    N11[\"在庫確認\\nstock, err := s.inventoryRepo.GetStock(ctx, item.ProductID)\"]\n    N12{{\"err != nil\"}}\n    N13([\"return err\"])\n    N14((\"終了\"))\n    N15[\"処理続行\"]\n    N16{{\"stock \\\u003c item.Quantity\"}}\n    N17([\"return \u0026\"])\n    N18((\"終了\"))\n    N19[\"処理続行\"]\n    N20([\"return nil\"])\n    N21((\"終了\"))\n    N1 --\u003e N2\n    N4 --\u003e N5\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N6\n    N6 --\u003e N7\n    N8 --\u003e N9\n    N7 --\u003e |Yes| N8\n    N7 --\u003e |No| N10\n    N10 --\u003e N11\n    N11 --\u003e N12\n    N13 --\u003e N14\n    N12 --\u003e |Yes| N13\n    N12 --\u003e |No| N15\n    N15 --\u003e N16\n    N17 --\u003e N18\n    N16 --\u003e |Yes| N17\n    N16 --\u003e |No| N19\n    N2 --\u003e |Body| N3\n    N19 --\u003e N2\n    N20 --\u003e N21\n    N2 --\u003e N20\n    click N11 \"javascript:navigateToFunction('s.inventoryRepo.GetStock')\"\n",
    "packageName": "service",
    "receiverType": "CartService"
  },
  "service.CouponService.ApplyCoupon": {
    "calledFunctions": [
      "s.calculateApplicableAmount",
      "int",
      "math.Floor",
      "float64"
    ],
    "comments": "ApplyCoupon クーポンを適用",
    "fileName": "application/service/coupon.go",
    "fullName": "service.CouponService.ApplyCoupon",
    "functionName": "ApplyCoupon",
    "mermaidCode": "flowchart TD\n    N1([\"`**CouponService.ApplyCoupon**`\"])\n    N2{{\"coupon == nil\"}}\n    N3([\"return nil\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"割引対象金額を計算\\napplicableAmount := s.calculateApplicableAmount(cart, coupon)\"]\n    N8[\"pricing.CouponDiscount = discountAmount\"]\n    N9[\"pricing.AppliedCouponCode = coupon.Code\"]\n    N10[\"合計金額を再計算\\nnetAmount := pricing.SubTotal - pricing.MemberDiscount - pricing.CouponDiscount\"]\n    N11{{\"netAmount \\\u003c 0\"}}\n    N12[\"netAmount = 0\"]\n    N13[\"処理続行\"]\n    N14[\"合流点\"]\n    N15[\"税金を再計算\\ntaxRate := pricing.TaxRate\"]\n    N16{{\"taxRate == 0\"}}\n    N17[\"taxRate = TaxRate\"]\n    N18[\"処理続行\"]\n    N19[\"合流点\"]\n    N20[\"pricing.Tax = int(math.Floor(float64(netAmount) * taxRate))\"]\n    N21[\"合計金額を更新\\npricing.TotalAmount = netAmount + pricing.Tax + pricing.ShippingFee\"]\n    N22([\"return nil\"])\n    N23((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N8 --\u003e N9\n    N9 --\u003e N10\n    N10 --\u003e N11\n    N11 --\u003e |Yes| N12\n    N11 --\u003e |No| N13\n    N12 --\u003e N14\n    N13 --\u003e N14\n    N14 --\u003e N15\n    N15 --\u003e N16\n    N16 --\u003e |Yes| N17\n    N16 --\u003e |No| N18\n    N17 --\u003e N19\n    N18 --\u003e N19\n    N19 --\u003e N20\n    N20 --\u003e N21\n    N22 --\u003e N23\n    N21 --\u003e N22\n    click N7 \"javascript:navigateToFunction('s.calculateApplicableAmount')\"\n    click N20 \"javascript:navigateToFunction('float64')\"\n",
    "packageName": "service",
    "receiverType": "CouponService"
  },
  "service.CouponService.UseCoupon": {
    "calledFunctions": [
      "s.couponRepo.IncrementUsage"
    ],
    "comments": "UseCoupon クーポンを使用済みにする",
    "fileName": "application/service/coupon.go",
    "fullName": "service.CouponService.UseCoupon",
    "functionName": "UseCoupon",
    "mermaidCode": "flowchart TD\n    N1([\"`**CouponService.UseCoupon**`\"])\n    N2([\"return s.couponRepo.IncrementUsage(ctx, code)\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n    click N2 \"javascript:navigateToFunction('s.couponRepo.IncrementUsage')\"\n",
    "packageName": "service",
    "receiverType": "CouponService"
  },
  "service.CouponService.ValidateCoupon": {
    "calledFunctions": [
      "s.couponRepo.GetByCode",
      "coupon.IsValid",
      "cart.GetTotalAmount",
      "len",
      "slices.Contains"
    ],
    "comments": "ValidateCoupon クーポンを検証",
    "fileName": "application/service/coupon.go",
    "fullName": "service.CouponService.ValidateCoupon",
    "functionName": "ValidateCoupon",
    "mermaidCode": "flowchart TD\n    N1([\"`**CouponService.ValidateCoupon**`\"])\n    N2[\"クーポンを取得\\ncoupon, err := s.couponRepo.GetByCode(ctx, code)\"]\n    N3{{\"err != nil\"}}\n    N4([\"return nil, \u0026\"])\n    N5((\"終了\"))\n    N6[\"処理続行\"]\n    N7[\"合流点\"]\n    N8{{\"クーポンの有効性をチェック\\n!coupon.IsValid()\"}}\n    N9([\"return nil, \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13[\"最低購入金額をチェック\\ncartTotal := cart.GetTotalAmount()\"]\n    N14{{\"cartTotal \\\u003c coupon.MinPurchaseAmount\"}}\n    N15([\"return nil, \u0026\"])\n    N16((\"終了\"))\n    N17[\"処理続行\"]\n    N18[\"合流点\"]\n    N19{{\"対象カテゴリをチェック\\nlen(coupon.TargetCategories) \\\u003e 0\"}}\n    N20[\"hasApplicableItem := false\"]\n    N21{{\"for _, item := range cart.Items\"}}\n    N22{{\"item.Product != nil \u0026\u0026 slices.Contains(coupon.TargetCategories, item.Product.Category)\"}}\n    N23[\"hasApplicableItem = true\"]\n    N24[\"処理続行\"]\n    N25{{\"!hasApplicableItem\"}}\n    N26([\"return nil, \u0026\"])\n    N27((\"終了\"))\n    N28[\"処理続行\"]\n    N29[\"処理続行\"]\n    N30[\"合流点\"]\n    N31([\"return coupon, nil\"])\n    N32((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N15 --\u003e N16\n    N14 --\u003e |Yes| N15\n    N14 --\u003e |No| N17\n    N17 --\u003e N18\n    N18 --\u003e N19\n    N20 --\u003e N21\n    N22 --\u003e |Yes| N23\n    N22 --\u003e |No| N24\n    N21 --\u003e |Body| N22\n    N24 --\u003e N21\n    N21 --\u003e N25\n    N26 --\u003e N27\n    N25 --\u003e |Yes| N26\n    N25 --\u003e |No| N28\n    N19 --\u003e |Yes| N20\n    N19 --\u003e |No| N29\n    N28 --\u003e N30\n    N29 --\u003e N30\n    N31 --\u003e N32\n    N30 --\u003e N31\n    click N8 \"javascript:navigateToFunction('coupon.IsValid')\"\n    click N13 \"javascript:navigateToFunction('cart.GetTotalAmount')\"\n    click N19 \"javascript:navigateToFunction('len')\"\n    click N22 \"javascript:navigateToFunction('slices.Contains')\"\n    click N2 \"javascript:navigateToFunction('s.couponRepo.GetByCode')\"\n",
    "packageName": "service",
    "receiverType": "CouponService"
  },
  "service.CouponService.calculateApplicableAmount": {
    "calledFunctions": [
      "len",
      "cart.GetTotalAmount",
      "slices.Contains",
      "item.GetSubtotal"
    ],
    "comments": "calculateApplicableAmount 割引対象金額を計算",
    "fileName": "application/service/coupon.go",
    "fullName": "service.CouponService.calculateApplicableAmount",
    "functionName": "calculateApplicableAmount",
    "mermaidCode": "flowchart TD\n    N1([\"`**CouponService.calculateApplicableAmount**`\"])\n    N2{{\"対象カテゴリが指定されていない場合は全額対象\\nlen(coupon.TargetCategories) == 0\"}}\n    N3([\"return cart.GetTotalAmount()\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"対象カテゴリの商品のみの金額を計算\\ntotal := 0\"]\n    N8{{\"for _, item := range cart.Items\"}}\n    N9{{\"item.Product != nil \u0026\u0026 slices.Contains(coupon.TargetCategories, item.Product.Category)\"}}\n    N10[\"total += item.GetSubtotal()\"]\n    N11[\"処理続行\"]\n    N12([\"return total\"])\n    N13((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e |Yes| N10\n    N9 --\u003e |No| N11\n    N8 --\u003e |Body| N9\n    N11 --\u003e N8\n    N12 --\u003e N13\n    N8 --\u003e N12\n    click N2 \"javascript:navigateToFunction('len')\"\n    click N3 \"javascript:navigateToFunction('cart.GetTotalAmount')\"\n    click N9 \"javascript:navigateToFunction('slices.Contains')\"\n    click N10 \"javascript:navigateToFunction('item.GetSubtotal')\"\n",
    "packageName": "service",
    "receiverType": "CouponService"
  },
  "service.InventoryService.CheckAvailability": {
    "calledFunctions": [
      "s.inventoryRepo.GetStock",
      "fmt.Errorf"
    ],
    "comments": "CheckAvailability 在庫の利用可能性を確認",
    "fileName": "application/service/inventory.go",
    "fullName": "service.InventoryService.CheckAvailability",
    "functionName": "CheckAvailability",
    "mermaidCode": "flowchart TD\n    N1([\"`**InventoryService.CheckAvailability**`\"])\n    N2{{\"for _, item := range items\"}}\n    N3[\"stock, err := s.inventoryRepo.GetStock(ctx, item.ProductID)\"]\n    N4{{\"err != nil\"}}\n    N5([\"return fmt.Errorf(#quot;在庫確認エラー（商品ID: %s）: %w#quot;, item.ProductID, err)\"])\n    N6((\"終了\"))\n    N7[\"処理続行\"]\n    N8{{\"stock \\\u003c item.Quantity\"}}\n    N9([\"return \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12([\"return nil\"])\n    N13((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N5 --\u003e N6\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N2 --\u003e |Body| N3\n    N11 --\u003e N2\n    N12 --\u003e N13\n    N2 --\u003e N12\n    click N3 \"javascript:navigateToFunction('s.inventoryRepo.GetStock')\"\n    click N5 \"javascript:navigateToFunction('fmt.Errorf')\"\n",
    "packageName": "service",
    "receiverType": "InventoryService"
  },
  "service.InventoryService.CommitStock": {
    "calledFunctions": [
      "s.inventoryRepo.Commit",
      "fmt.Errorf"
    ],
    "comments": "CommitStock 在庫を確定（実際に減らす）",
    "fileName": "application/service/inventory.go",
    "fullName": "service.InventoryService.CommitStock",
    "functionName": "CommitStock",
    "mermaidCode": "flowchart TD\n    N1([\"`**InventoryService.CommitStock**`\"])\n    N2{{\"for _, item := range items\"}}\n    N3[\"err := s.inventoryRepo.Commit(ctx, item.ProductID, item.Quantity)\"]\n    N4{{\"err != nil\"}}\n    N5([\"return fmt.Errorf(#quot;在庫確定エラー（商品ID: %s）: %w#quot;, item.ProductID, err)\"])\n    N6((\"終了\"))\n    N7[\"処理続行\"]\n    N8([\"return nil\"])\n    N9((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N5 --\u003e N6\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N7\n    N2 --\u003e |Body| N3\n    N7 --\u003e N2\n    N8 --\u003e N9\n    N2 --\u003e N8\n    click N3 \"javascript:navigateToFunction('s.inventoryRepo.Commit')\"\n    click N5 \"javascript:navigateToFunction('fmt.Errorf')\"\n",
    "packageName": "service",
    "receiverType": "InventoryService"
  },
  "service.InventoryService.ReleaseStock": {
    "calledFunctions": [
      "s.inventoryRepo.Release",
      "fmt.Errorf"
    ],
    "comments": "ReleaseStock 予約済み在庫を解放",
    "fileName": "application/service/inventory.go",
    "fullName": "service.InventoryService.ReleaseStock",
    "functionName": "ReleaseStock",
    "mermaidCode": "flowchart TD\n    N1([\"`**InventoryService.ReleaseStock**`\"])\n    N2{{\"for _, item := range items\"}}\n    N3[\"err := s.inventoryRepo.Release(ctx, item.ProductID, item.Quantity)\"]\n    N4{{\"err != nil\"}}\n    N5[\"lastErr = fmt.Errorf(#quot;在庫解放エラー（商品ID: %s）: %w#quot;, item.ProductID, err)\"]\n    N6[\"処理続行\"]\n    N7([\"return lastErr\"])\n    N8((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N6\n    N2 --\u003e |Body| N3\n    N6 --\u003e N2\n    N7 --\u003e N8\n    N2 --\u003e N7\n    click N3 \"javascript:navigateToFunction('s.inventoryRepo.Release')\"\n    click N5 \"javascript:navigateToFunction('fmt.Errorf')\"\n",
    "packageName": "service",
    "receiverType": "InventoryService"
  },
  "service.InventoryService.ReserveStock": {
    "calledFunctions": [
      "make",
      "len",
      "s.inventoryRepo.Reserve",
      "s.inventoryRepo.Release",
      "fmt.Errorf",
      "append"
    ],
    "comments": "ReserveStock 在庫を予約（引当）",
    "fileName": "application/service/inventory.go",
    "fullName": "service.InventoryService.ReserveStock",
    "functionName": "ReserveStock",
    "mermaidCode": "flowchart TD\n    N1([\"`**InventoryService.ReserveStock**`\"])\n    N2[\"reservedItems := make(, 0, len(items))\"]\n    N3{{\"for _, item := range items\"}}\n    N4[\"err := s.inventoryRepo.Reserve(ctx, item.ProductID, item.Quantity)\"]\n    N5{{\"err != nil\"}}\n    N6{{\"for _, reserved := range reservedItems\"}}\n    N7[\"_ = s.inventoryRepo.Release(ctx, reserved.ProductID, reserved.Quantity)\"]\n    N8([\"return fmt.Errorf(#quot;在庫予約エラー（商品ID: %s）: %w#quot;, item.ProductID, err)\"])\n    N9((\"終了\"))\n    N10[\"処理続行\"]\n    N11[\"reservedItems = append(reservedItems, item)\"]\n    N12([\"return nil\"])\n    N13((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N6 --\u003e |Body| N7\n    N7 --\u003e N6\n    N8 --\u003e N9\n    N6 --\u003e N8\n    N5 --\u003e |Yes| N6\n    N5 --\u003e |No| N10\n    N10 --\u003e N11\n    N3 --\u003e |Body| N4\n    N11 --\u003e N3\n    N12 --\u003e N13\n    N3 --\u003e N12\n    click N2 \"javascript:navigateToFunction('len')\"\n    click N4 \"javascript:navigateToFunction('s.inventoryRepo.Reserve')\"\n    click N7 \"javascript:navigateToFunction('s.inventoryRepo.Release')\"\n    click N8 \"javascript:navigateToFunction('fmt.Errorf')\"\n    click N11 \"javascript:navigateToFunction('append')\"\n",
    "packageName": "service",
    "receiverType": "InventoryService"
  },
  "service.InventoryService.RestoreStock": {
    "calledFunctions": [
      "s.inventoryRepo.Release",
      "fmt.Errorf"
    ],
    "comments": "RestoreStock 在庫を復元（返金時）",
    "fileName": "application/service/inventory.go",
    "fullName": "service.InventoryService.RestoreStock",
    "functionName": "RestoreStock",
    "mermaidCode": "flowchart TD\n    N1([\"`**InventoryService.RestoreStock**`\"])\n    N2{{\"for _, item := range items\"}}\n    N3[\"在庫を戻す（Releaseとは異なり、実在庫を増やす）\\nerr := s.inventoryRepo.Release(ctx, item.ProductID, item.Quantity)\"]\n    N4{{\"err != nil\"}}\n    N5([\"return fmt.Errorf(#quot;在庫復元エラー（商品ID: %s）: %w#quot;, item.ProductID, err)\"])\n    N6((\"終了\"))\n    N7[\"処理続行\"]\n    N8([\"return nil\"])\n    N9((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N5 --\u003e N6\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N7\n    N2 --\u003e |Body| N3\n    N7 --\u003e N2\n    N8 --\u003e N9\n    N2 --\u003e N8\n    click N5 \"javascript:navigateToFunction('fmt.Errorf')\"\n    click N3 \"javascript:navigateToFunction('s.inventoryRepo.Release')\"\n",
    "packageName": "service",
    "receiverType": "InventoryService"
  },
  "service.NewCartService": {
    "calledFunctions": null,
    "comments": "NewCartService コンストラクタ",
    "fileName": "application/service/cart.go",
    "fullName": "service.NewCartService",
    "functionName": "NewCartService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewCartService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NewCouponService": {
    "calledFunctions": null,
    "comments": "NewCouponService コンストラクタ",
    "fileName": "application/service/coupon.go",
    "fullName": "service.NewCouponService",
    "functionName": "NewCouponService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewCouponService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NewInventoryService": {
    "calledFunctions": null,
    "comments": "NewInventoryService コンストラクタ",
    "fileName": "application/service/inventory.go",
    "fullName": "service.NewInventoryService",
    "functionName": "NewInventoryService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewInventoryService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NewNotificationService": {
    "calledFunctions": null,
    "comments": "NewNotificationService コンストラクタ",
    "fileName": "application/service/notification.go",
    "fullName": "service.NewNotificationService",
    "functionName": "NewNotificationService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewNotificationService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NewPaymentService": {
    "calledFunctions": null,
    "comments": "NewPaymentService コンストラクタ",
    "fileName": "application/service/payment.go",
    "fullName": "service.NewPaymentService",
    "functionName": "NewPaymentService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewPaymentService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NewPricingService": {
    "calledFunctions": null,
    "comments": "NewPricingService コンストラクタ",
    "fileName": "application/service/pricing.go",
    "fullName": "service.NewPricingService",
    "functionName": "NewPricingService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewPricingService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NewShippingService": {
    "calledFunctions": null,
    "comments": "NewShippingService コンストラクタ",
    "fileName": "application/service/shipping.go",
    "fullName": "service.NewShippingService",
    "functionName": "NewShippingService",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewShippingService**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": ""
  },
  "service.NotificationService.SendDeliveryNotification": {
    "calledFunctions": [
      "fmt.Errorf",
      "fmt.Sprintf",
      "s.buildDeliveryNotificationBody",
      "s.sendEmail"
    ],
    "comments": "SendDeliveryNotification 配送完了通知を送信",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.SendDeliveryNotification",
    "functionName": "SendDeliveryNotification",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.SendDeliveryNotification**`\"])\n    N2{{\"customer == nil || order == nil\"}}\n    N3([\"return fmt.Errorf(#quot;customer and order are required#quot;)\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"subject := fmt.Sprintf(#quot;【配送完了のお知らせ】注文番号: %s#quot;, order.ID)\"]\n    N8[\"body := s.buildDeliveryNotificationBody(customer, order)\"]\n    N9([\"return s.sendEmail(ctx, customer.Email, subject, body)\"])\n    N10((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e N9\n    click N3 \"javascript:navigateToFunction('fmt.Errorf')\"\n    click N7 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N8 \"javascript:navigateToFunction('s.buildDeliveryNotificationBody')\"\n    click N9 \"javascript:navigateToFunction('s.sendEmail')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.SendOrderConfirmation": {
    "calledFunctions": [
      "fmt.Errorf",
      "fmt.Sprintf",
      "s.buildOrderConfirmationBody",
      "s.sendEmail"
    ],
    "comments": "SendOrderConfirmation 注文確認通知を送信",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.SendOrderConfirmation",
    "functionName": "SendOrderConfirmation",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.SendOrderConfirmation**`\"])\n    N2{{\"customer == nil || order == nil\"}}\n    N3([\"return fmt.Errorf(#quot;customer and order are required#quot;)\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"メール送信（モック）\\nsubject := fmt.Sprintf(#quot;【ご注文確認】注文番号: %s#quot;, order.ID)\"]\n    N8[\"body := s.buildOrderConfirmationBody(customer, order)\"]\n    N9([\"return s.sendEmail(ctx, customer.Email, subject, body)\"])\n    N10((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e N9\n    click N9 \"javascript:navigateToFunction('s.sendEmail')\"\n    click N3 \"javascript:navigateToFunction('fmt.Errorf')\"\n    click N7 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N8 \"javascript:navigateToFunction('s.buildOrderConfirmationBody')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.SendRefundNotification": {
    "calledFunctions": [
      "fmt.Errorf",
      "fmt.Sprintf",
      "s.buildRefundNotificationBody",
      "s.sendEmail"
    ],
    "comments": "SendRefundNotification 返金完了通知を送信",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.SendRefundNotification",
    "functionName": "SendRefundNotification",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.SendRefundNotification**`\"])\n    N2{{\"customer == nil || order == nil\"}}\n    N3([\"return fmt.Errorf(#quot;customer and order are required#quot;)\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"subject := fmt.Sprintf(#quot;【返金完了のお知らせ】注文番号: %s#quot;, order.ID)\"]\n    N8[\"body := s.buildRefundNotificationBody(customer, order)\"]\n    N9([\"return s.sendEmail(ctx, customer.Email, subject, body)\"])\n    N10((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e N9\n    click N7 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N8 \"javascript:navigateToFunction('s.buildRefundNotificationBody')\"\n    click N9 \"javascript:navigateToFunction('s.sendEmail')\"\n    click N3 \"javascript:navigateToFunction('fmt.Errorf')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.SendShippingNotification": {
    "calledFunctions": [
      "fmt.Errorf",
      "fmt.Sprintf",
      "s.buildShippingNotificationBody",
      "s.sendEmail"
    ],
    "comments": "SendShippingNotification 発送通知を送信",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.SendShippingNotification",
    "functionName": "SendShippingNotification",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.SendShippingNotification**`\"])\n    N2{{\"customer == nil || order == nil\"}}\n    N3([\"return fmt.Errorf(#quot;customer and order are required#quot;)\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"subject := fmt.Sprintf(#quot;【発送のお知らせ】注文番号: %s#quot;, order.ID)\"]\n    N8[\"body := s.buildShippingNotificationBody(customer, order)\"]\n    N9([\"return s.sendEmail(ctx, customer.Email, subject, body)\"])\n    N10((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e N9\n    click N7 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N8 \"javascript:navigateToFunction('s.buildShippingNotificationBody')\"\n    click N9 \"javascript:navigateToFunction('s.sendEmail')\"\n    click N3 \"javascript:navigateToFunction('fmt.Errorf')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.buildDeliveryNotificationBody": {
    "calledFunctions": [
      "fmt.Sprintf"
    ],
    "comments": "buildDeliveryNotificationBody 配送完了通知メール本文を作成",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.buildDeliveryNotificationBody",
    "functionName": "buildDeliveryNotificationBody",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.buildDeliveryNotificationBody**`\"])\n    N2([\"return fmt.Sprintf(`\n%s 様\n\nご注文の商品が配送完了いたしました。\n\n■ 注文番号: %s\n\n商品をお受け取りいただきありがとうございました。\nまたのご利用をお待ちしております。\n`, customer.Name, order.ID)\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n    click N2 \"javascript:navigateToFunction('fmt.Sprintf')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.buildOrderConfirmationBody": {
    "calledFunctions": [
      "fmt.Sprintf",
      "order.CreatedAt.Format",
      "item.GetSubtotal",
      "order.Pricing.GetDiscountTotal",
      "order.Shipping.EstimatedDate.Format"
    ],
    "comments": "buildOrderConfirmationBody 注文確認メール本文を作成",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.buildOrderConfirmationBody",
    "functionName": "buildOrderConfirmationBody",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.buildOrderConfirmationBody**`\"])\n    N2[\"body := fmt.Sprintf(`\n%s 様\n\nこの度はご注文いただきありがとうございます。\n\n■ 注文情報\n注文番号: %s\n注文日時: %s\n\n■ ご注文内容\n`, customer.Name, order.ID, order.CreatedAt.Format(#quot;2006/01/02 15:04#quot;))\"]\n    N3{{\"カートアイテムを追加\\norder.Cart != nil\"}}\n    N4{{\"for _, item := range order.Cart.Items\"}}\n    N5{{\"item.Product != nil\"}}\n    N6[\"body += fmt.Sprintf(#quot;・%s × %d個 ¥%d\\n#quot;, item.Product.Name, item.Quantity, item.GetSubtotal())\"]\n    N7[\"処理続行\"]\n    N8[\"処理続行\"]\n    N9[\"合流点\"]\n    N10{{\"金額情報を追加\\norder.Pricing != nil\"}}\n    N11[\"body += fmt.Sprintf(`\n■ 金額\n商品小計: ¥%d\n割引: -¥%d\n消費税: ¥%d\n配送料: ¥%d\n合計: ¥%d\n`, order.Pricing.SubTotal, order.Pricing.GetDiscountTotal(), order.Pricing.Tax, order.Pricing.ShippingFee, order.Pricing.TotalAmount)\"]\n    N12[\"処理続行\"]\n    N13[\"合流点\"]\n    N14{{\"配送情報を追加\\norder.Shipping != nil \u0026\u0026 order.Shipping.Address != nil\"}}\n    N15[\"body += fmt.Sprintf(`\n■ 配送先\n%s\n〒%s\n%s%s%s\n`, order.Shipping.Address.RecipientName, order.Shipping.Address.PostalCode, order.Shipping.Address.Prefecture, order.Shipping.Address.City, order.Shipping.Address.AddressLine1)\"]\n    N16[\"body += fmt.Sprintf(#quot;\\n配送予定日: %s\\n#quot;, order.Shipping.EstimatedDate.Format(#quot;2006/01/02#quot;))\"]\n    N17[\"処理続行\"]\n    N18[\"合流点\"]\n    N19([\"return body\"])\n    N20((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N5 --\u003e |Yes| N6\n    N5 --\u003e |No| N7\n    N4 --\u003e |Body| N5\n    N7 --\u003e N4\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N8\n    N4 --\u003e N9\n    N8 --\u003e N9\n    N9 --\u003e N10\n    N10 --\u003e |Yes| N11\n    N10 --\u003e |No| N12\n    N11 --\u003e N13\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N15 --\u003e N16\n    N14 --\u003e |Yes| N15\n    N14 --\u003e |No| N17\n    N16 --\u003e N18\n    N17 --\u003e N18\n    N19 --\u003e N20\n    N18 --\u003e N19\n    click N6 \"javascript:navigateToFunction('item.GetSubtotal')\"\n    click N11 \"javascript:navigateToFunction('order.Pricing.GetDiscountTotal')\"\n    click N15 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N16 \"javascript:navigateToFunction('order.Shipping.EstimatedDate.Format')\"\n    click N2 \"javascript:navigateToFunction('order.CreatedAt.Format')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.buildRefundNotificationBody": {
    "calledFunctions": [
      "fmt.Sprintf"
    ],
    "comments": "buildRefundNotificationBody 返金完了通知メール本文を作成",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.buildRefundNotificationBody",
    "functionName": "buildRefundNotificationBody",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.buildRefundNotificationBody**`\"])\n    N2[\"body := fmt.Sprintf(`\n%s 様\n\n返金処理が完了いたしました。\n\n■ 注文番号: %s\n`, customer.Name, order.ID)\"]\n    N3{{\"order.Payment != nil\"}}\n    N4[\"body += fmt.Sprintf(`\n■ 返金情報\n返金額: ¥%d\n`, order.Payment.RefundAmount)\"]\n    N5{{\"order.Payment.RefundPointsReturn \\\u003e 0\"}}\n    N6[\"body += fmt.Sprintf(#quot;返還ポイント: %dポイント\\n#quot;, order.Payment.RefundPointsReturn)\"]\n    N7[\"処理続行\"]\n    N8[\"処理続行\"]\n    N9[\"合流点\"]\n    N10([\"return body\"])\n    N11((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N5 --\u003e |Yes| N6\n    N5 --\u003e |No| N7\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N8\n    N7 --\u003e N9\n    N8 --\u003e N9\n    N10 --\u003e N11\n    N9 --\u003e N10\n    click N2 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N4 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N6 \"javascript:navigateToFunction('fmt.Sprintf')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.buildShippingNotificationBody": {
    "calledFunctions": [
      "fmt.Sprintf",
      "order.Shipping.EstimatedDate.Format"
    ],
    "comments": "buildShippingNotificationBody 発送通知メール本文を作成",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.buildShippingNotificationBody",
    "functionName": "buildShippingNotificationBody",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.buildShippingNotificationBody**`\"])\n    N2[\"body := fmt.Sprintf(`\n%s 様\n\nご注文の商品を発送いたしました。\n\n■ 注文番号: %s\n`, customer.Name, order.ID)\"]\n    N3{{\"order.Shipping != nil\"}}\n    N4[\"body += fmt.Sprintf(`\n■ 配送情報\n追跡番号: %s\n配送予定日: %s\n`, order.Shipping.TrackingNumber, order.Shipping.EstimatedDate.Format(#quot;2006/01/02#quot;))\"]\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7([\"return body\"])\n    N8((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N5\n    N4 --\u003e N6\n    N5 --\u003e N6\n    N7 --\u003e N8\n    N6 --\u003e N7\n    click N2 \"javascript:navigateToFunction('fmt.Sprintf')\"\n    click N4 \"javascript:navigateToFunction('order.Shipping.EstimatedDate.Format')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.NotificationService.sendEmail": {
    "calledFunctions": [
      "log.Printf"
    ],
    "comments": "sendEmail メールを送信（モック）",
    "fileName": "application/service/notification.go",
    "fullName": "service.NotificationService.sendEmail",
    "functionName": "sendEmail",
    "mermaidCode": "flowchart TD\n    N1([\"`**NotificationService.sendEmail**`\"])\n    N2[\"実際のメール送信処理をシミュレート\\nlog.Printf(#quot;[EMAIL] To: %s, Subject: %s#quot;, to, subject)\"]\n    N3[\"log.Printf(#quot;[EMAIL] Body:\\n%s#quot;, body)\"]\n    N4([\"return nil\"])\n    N5((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e N4\n    click N2 \"javascript:navigateToFunction('log.Printf')\"\n    click N3 \"javascript:navigateToFunction('log.Printf')\"\n",
    "packageName": "service",
    "receiverType": "NotificationService"
  },
  "service.PaymentService.ProcessPayment": {
    "calledFunctions": [
      "s.ValidatePaymentMethod",
      "String",
      "uuid.New",
      "time.Now",
      "s.processCreditCardPayment",
      "s.processBankTransferPayment",
      "s.processPointsPayment",
      "s.processCombinedPayment"
    ],
    "comments": "ProcessPayment 決済を処理",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.ProcessPayment",
    "functionName": "ProcessPayment",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.ProcessPayment**`\"])\n    N2{{\"決済方法のバリデーション\\nerr != nil\"}}\n    N3([\"return nil, err\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"payment := \u0026\"]\n    N8([\"return payment, nil\"])\n    N9((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N8 --\u003e N9\n    N7 --\u003e N8\n    click N7 \"javascript:navigateToFunction('time.Now')\"\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PaymentService.RefundPayment": {
    "calledFunctions": [
      "payment.CanRefund",
      "time.Now",
      "payment.IsPointsPayment",
      "s.customerRepo.UpdatePointBalance"
    ],
    "comments": "RefundPayment 返金処理",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.RefundPayment",
    "functionName": "RefundPayment",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.RefundPayment**`\"])\n    N2{{\"!payment.CanRefund()\"}}\n    N3([\"return \u0026\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"返金処理（モック）\\npayment.RefundAmount = payment.Amount\"]\n    N8[\"payment.RefundedAt = time.Now()\"]\n    N9[\"payment.Status = entity.PaymentStatusRefunded\"]\n    N10{{\"ポイントを使用していた場合は返還\\npayment.IsPointsPayment() \u0026\u0026 payment.PointsUsed \\\u003e 0 \u0026\u0026 customer != nil\"}}\n    N11[\"payment.RefundPointsReturn = payment.PointsUsed\"]\n    N12[\"newBalance := customer.PointBalance + payment.PointsUsed\"]\n    N13{{\"err != nil\"}}\n    N14([\"return \u0026\"])\n    N15((\"終了\"))\n    N16[\"処理続行\"]\n    N17[\"処理続行\"]\n    N18[\"合流点\"]\n    N19([\"return nil\"])\n    N20((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N8 --\u003e N9\n    N9 --\u003e N10\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N14 --\u003e N15\n    N13 --\u003e |Yes| N14\n    N13 --\u003e |No| N16\n    N10 --\u003e |Yes| N11\n    N10 --\u003e |No| N17\n    N16 --\u003e N18\n    N17 --\u003e N18\n    N19 --\u003e N20\n    N18 --\u003e N19\n    click N8 \"javascript:navigateToFunction('time.Now')\"\n    click N10 \"javascript:navigateToFunction('payment.IsPointsPayment')\"\n    click N2 \"javascript:navigateToFunction('payment.CanRefund')\"\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PaymentService.ValidatePaymentMethod": {
    "calledFunctions": [
      "customer.CanUsePoints"
    ],
    "comments": "ValidatePaymentMethod 決済方法を検証",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.ValidatePaymentMethod",
    "functionName": "ValidatePaymentMethod",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.ValidatePaymentMethod**`\"])\n    N2([\"return nil\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PaymentService.processBankTransferPayment": {
    "calledFunctions": [
      "String",
      "uuid.New"
    ],
    "comments": "processBankTransferPayment 銀行振込処理（モック）",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.processBankTransferPayment",
    "functionName": "processBankTransferPayment",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.processBankTransferPayment**`\"])\n    N2[\"銀行振込は入金待ち状態\\npayment.TransactionID = #quot;BT-#quot; + uuid.New().String()\"]\n    N3[\"payment.Status = entity.PaymentStatusPending\"]\n    N4([\"return nil\"])\n    N5((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e N4\n    click N2 \"javascript:navigateToFunction('uuid.New')\"\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PaymentService.processCombinedPayment": {
    "calledFunctions": [
      "customer.CanUsePoints",
      "s.customerRepo.UpdatePointBalance",
      "String",
      "uuid.New"
    ],
    "comments": "processCombinedPayment ポイント併用決済処理",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.processCombinedPayment",
    "functionName": "processCombinedPayment",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.processCombinedPayment**`\"])\n    N2{{\"!customer.CanUsePoints(pointsToUse)\"}}\n    N3([\"return \u0026\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"ポイントを消費\\nnewBalance := customer.PointBalance - pointsToUse\"]\n    N8{{\"err != nil\"}}\n    N9([\"return \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13[\"残額をクレジットカードで決済\\ncashAmount := payment.Amount - pointsToUse\"]\n    N14{{\"cashAmount \\\u003c 0\"}}\n    N15[\"cashAmount = 0\"]\n    N16[\"処理続行\"]\n    N17[\"合流点\"]\n    N18[\"payment.PointsUsed = pointsToUse\"]\n    N19[\"payment.CashAmount = cashAmount\"]\n    N20[\"payment.TransactionID = #quot;CB-#quot; + uuid.New().String()\"]\n    N21[\"payment.Status = entity.PaymentStatusCompleted\"]\n    N22([\"return nil\"])\n    N23((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N14 --\u003e |Yes| N15\n    N14 --\u003e |No| N16\n    N15 --\u003e N17\n    N16 --\u003e N17\n    N17 --\u003e N18\n    N18 --\u003e N19\n    N19 --\u003e N20\n    N20 --\u003e N21\n    N22 --\u003e N23\n    N21 --\u003e N22\n    click N2 \"javascript:navigateToFunction('customer.CanUsePoints')\"\n    click N20 \"javascript:navigateToFunction('uuid.New')\"\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PaymentService.processCreditCardPayment": {
    "calledFunctions": [
      "String",
      "uuid.New"
    ],
    "comments": "processCreditCardPayment クレジットカード決済処理（モック）",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.processCreditCardPayment",
    "functionName": "processCreditCardPayment",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.processCreditCardPayment**`\"])\n    N2[\"実際の決済処理をシミュレート\\npayment.TransactionID = #quot;CC-#quot; + uuid.New().String()\"]\n    N3[\"payment.Status = entity.PaymentStatusCompleted\"]\n    N4([\"return nil\"])\n    N5((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e N4\n    click N2 \"javascript:navigateToFunction('uuid.New')\"\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PaymentService.processPointsPayment": {
    "calledFunctions": [
      "customer.CanUsePoints",
      "s.customerRepo.UpdatePointBalance",
      "String",
      "uuid.New"
    ],
    "comments": "processPointsPayment ポイント全額決済処理",
    "fileName": "application/service/payment.go",
    "fullName": "service.PaymentService.processPointsPayment",
    "functionName": "processPointsPayment",
    "mermaidCode": "flowchart TD\n    N1([\"`**PaymentService.processPointsPayment**`\"])\n    N2{{\"!customer.CanUsePoints(amount)\"}}\n    N3([\"return \u0026\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"ポイントを消費\\nnewBalance := customer.PointBalance - amount\"]\n    N8{{\"err != nil\"}}\n    N9([\"return \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13[\"payment.PointsUsed = amount\"]\n    N14[\"payment.CashAmount = 0\"]\n    N15[\"payment.TransactionID = #quot;PT-#quot; + uuid.New().String()\"]\n    N16[\"payment.Status = entity.PaymentStatusCompleted\"]\n    N17([\"return nil\"])\n    N18((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N14 --\u003e N15\n    N15 --\u003e N16\n    N17 --\u003e N18\n    N16 --\u003e N17\n    click N2 \"javascript:navigateToFunction('customer.CanUsePoints')\"\n    click N15 \"javascript:navigateToFunction('uuid.New')\"\n",
    "packageName": "service",
    "receiverType": "PaymentService"
  },
  "service.PricingService.ApplyMemberDiscount": {
    "calledFunctions": [
      "customer.GetDiscountRate",
      "int",
      "math.Floor",
      "float64"
    ],
    "comments": "ApplyMemberDiscount 会員割引を適用",
    "fileName": "application/service/pricing.go",
    "fullName": "service.PricingService.ApplyMemberDiscount",
    "functionName": "ApplyMemberDiscount",
    "mermaidCode": "flowchart TD\n    N1([\"`**PricingService.ApplyMemberDiscount**`\"])\n    N2{{\"customer == nil\"}}\n    N3([\"return nil\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"会員ランクに応じた割引率を取得\\ndiscountRate := customer.GetDiscountRate()\"]\n    N8{{\"discountRate \\\u003c= 0\"}}\n    N9([\"return nil\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13[\"割引額を計算（小数点以下切り捨て）\\ndiscountAmount := int(math.Floor(float64(pricing.SubTotal) * discountRate))\"]\n    N14[\"pricing.MemberDiscount = discountAmount\"]\n    N15([\"return nil\"])\n    N16((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N15 --\u003e N16\n    N14 --\u003e N15\n    click N7 \"javascript:navigateToFunction('customer.GetDiscountRate')\"\n    click N13 \"javascript:navigateToFunction('float64')\"\n",
    "packageName": "service",
    "receiverType": "PricingService"
  },
  "service.PricingService.Calculate": {
    "calledFunctions": [
      "cart.GetTotalAmount",
      "s.ApplyMemberDiscount",
      "s.CalculateShippingFee",
      "s.CalculateTax",
      "s.CalculatePointsToEarn"
    ],
    "comments": "Calculate 価格を計算",
    "fileName": "application/service/pricing.go",
    "fullName": "service.PricingService.Calculate",
    "functionName": "Calculate",
    "mermaidCode": "flowchart TD\n    N1([\"`**PricingService.Calculate**`\"])\n    N2[\"pricing := \u0026\"]\n    N3[\"商品小計を計算\\npricing.SubTotal = cart.GetTotalAmount()\"]\n    N4{{\"会員割引を適用\\nerr != nil\"}}\n    N5([\"return nil, err\"])\n    N6((\"終了\"))\n    N7[\"処理続行\"]\n    N8[\"合流点\"]\n    N9[\"配送料を計算\\npricing.ShippingFee = s.CalculateShippingFee(cart, shippingMethod)\"]\n    N10[\"税込金額を計算\\nnetAmount := pricing.SubTotal - pricing.MemberDiscount - pricing.CouponDiscount\"]\n    N11{{\"netAmount \\\u003c 0\"}}\n    N12[\"netAmount = 0\"]\n    N13[\"処理続行\"]\n    N14[\"合流点\"]\n    N15[\"配送料は非課税として、商品金額のみに税金を適用\\npricing.Tax = s.CalculateTax(netAmount)\"]\n    N16[\"合計金額を計算\\npricing.TotalAmount = netAmount + pricing.Tax + pricing.ShippingFee\"]\n    N17[\"獲得ポイントを計算\\npricing.PointsToEarn = s.CalculatePointsToEarn(pricing.TotalAmount, customer)\"]\n    N18([\"return pricing, nil\"])\n    N19((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N3 --\u003e N4\n    N5 --\u003e N6\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N7\n    N7 --\u003e N8\n    N8 --\u003e N9\n    N9 --\u003e N10\n    N10 --\u003e N11\n    N11 --\u003e |Yes| N12\n    N11 --\u003e |No| N13\n    N12 --\u003e N14\n    N13 --\u003e N14\n    N14 --\u003e N15\n    N15 --\u003e N16\n    N16 --\u003e N17\n    N18 --\u003e N19\n    N17 --\u003e N18\n    click N3 \"javascript:navigateToFunction('cart.GetTotalAmount')\"\n    click N9 \"javascript:navigateToFunction('s.CalculateShippingFee')\"\n    click N15 \"javascript:navigateToFunction('s.CalculateTax')\"\n    click N17 \"javascript:navigateToFunction('s.CalculatePointsToEarn')\"\n",
    "packageName": "service",
    "receiverType": "PricingService"
  },
  "service.PricingService.CalculatePointsToEarn": {
    "calledFunctions": [
      "customer.IsPremium",
      "int",
      "math.Floor",
      "float64"
    ],
    "comments": "CalculatePointsToEarn 獲得予定ポイントを計算",
    "fileName": "application/service/pricing.go",
    "fullName": "service.PricingService.CalculatePointsToEarn",
    "functionName": "CalculatePointsToEarn",
    "mermaidCode": "flowchart TD\n    N1([\"`**PricingService.CalculatePointsToEarn**`\"])\n    N2{{\"customer == nil\"}}\n    N3([\"return 0\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"プレミアム会員は還元率アップ\\nearnRate := PointEarnRate\"]\n    N8{{\"customer.IsPremium()\"}}\n    N9[\"earnRate = PremiumPointEarnRate\"]\n    N10[\"処理続行\"]\n    N11[\"合流点\"]\n    N12([\"ポイントは切り捨て\\nreturn int(math.Floor(float64(totalAmount) * earnRate))\"])\n    N13((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N10\n    N9 --\u003e N11\n    N10 --\u003e N11\n    N12 --\u003e N13\n    N11 --\u003e N12\n    click N8 \"javascript:navigateToFunction('customer.IsPremium')\"\n    click N12 \"javascript:navigateToFunction('float64')\"\n",
    "packageName": "service",
    "receiverType": "PricingService"
  },
  "service.PricingService.CalculateShippingFee": {
    "calledFunctions": [
      "cart.GetTotalAmount",
      "cart.GetTotalWeight"
    ],
    "comments": "CalculateShippingFee 配送料を計算",
    "fileName": "application/service/pricing.go",
    "fullName": "service.PricingService.CalculateShippingFee",
    "functionName": "CalculateShippingFee",
    "mermaidCode": "flowchart TD\n    N1([\"`**PricingService.CalculateShippingFee**`\"])\n    N2{{\"店舗受取は配送料なし\\nshippingMethod == entity.ShippingMethodPickup\"}}\n    N3([\"return 0\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7{{\"一定金額以上で送料無料\\ncart.GetTotalAmount() \\\u003e= FreeShippingThreshold\"}}\n    N8([\"return 0\"])\n    N9((\"終了\"))\n    N10[\"処理続行\"]\n    N11[\"合流点\"]\n    N12[\"基本配送料\\nbaseFee := StandardShippingFee\"]\n    N13{{\"shippingMethod == entity.ShippingMethodExpress\"}}\n    N14[\"baseFee = ExpressShippingFee\"]\n    N15[\"処理続行\"]\n    N16[\"合流点\"]\n    N17[\"重量による追加料金\\ntotalWeight := cart.GetTotalWeight()\"]\n    N18{{\"totalWeight \\\u003e= HeavyWeightThreshold\"}}\n    N19[\"baseFee += HeavyWeightFee\"]\n    N20[\"処理続行\"]\n    N21[\"合流点\"]\n    N22([\"return baseFee\"])\n    N23((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N8 --\u003e N9\n    N7 --\u003e |Yes| N8\n    N7 --\u003e |No| N10\n    N10 --\u003e N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e |Yes| N14\n    N13 --\u003e |No| N15\n    N14 --\u003e N16\n    N15 --\u003e N16\n    N16 --\u003e N17\n    N17 --\u003e N18\n    N18 --\u003e |Yes| N19\n    N18 --\u003e |No| N20\n    N19 --\u003e N21\n    N20 --\u003e N21\n    N22 --\u003e N23\n    N21 --\u003e N22\n    click N7 \"javascript:navigateToFunction('cart.GetTotalAmount')\"\n    click N17 \"javascript:navigateToFunction('cart.GetTotalWeight')\"\n",
    "packageName": "service",
    "receiverType": "PricingService"
  },
  "service.PricingService.CalculateTax": {
    "calledFunctions": [
      "int",
      "math.Floor",
      "float64"
    ],
    "comments": "CalculateTax 消費税を計算",
    "fileName": "application/service/pricing.go",
    "fullName": "service.PricingService.CalculateTax",
    "functionName": "CalculateTax",
    "mermaidCode": "flowchart TD\n    N1([\"`**PricingService.CalculateTax**`\"])\n    N2([\"税額は切り捨て\\nreturn int(math.Floor(float64(amount) * TaxRate))\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n    click N2 \"javascript:navigateToFunction('float64')\"\n",
    "packageName": "service",
    "receiverType": "PricingService"
  },
  "service.ShippingService.ArrangeShipping": {
    "calledFunctions": [
      "s.CalculateEstimatedDelivery",
      "s.generateTrackingNumber",
      "s.calculateShippingFee"
    ],
    "comments": "ArrangeShipping 配送を手配",
    "fileName": "application/service/shipping.go",
    "fullName": "service.ShippingService.ArrangeShipping",
    "functionName": "ArrangeShipping",
    "mermaidCode": "flowchart TD\n    N1([\"`**ShippingService.ArrangeShipping**`\"])\n    N2[\"shipping := \u0026\"]\n    N3{{\"店舗受取以外は配送先住所を設定\\nmethod != entity.ShippingMethodPickup\"}}\n    N4{{\"address == nil\"}}\n    N5([\"return nil, \u0026\"])\n    N6((\"終了\"))\n    N7[\"処理続行\"]\n    N8[\"shipping.Address = \u0026\"]\n    N9[\"追跡番号を発行（モック）\\nshipping.TrackingNumber = s.generateTrackingNumber(method)\"]\n    N10[\"処理続行\"]\n    N11[\"合流点\"]\n    N12[\"配送料を計算\\nshipping.Fee = s.calculateShippingFee(method, cart)\"]\n    N13([\"return shipping, nil\"])\n    N14((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N5 --\u003e N6\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N7\n    N7 --\u003e N8\n    N8 --\u003e N9\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N10\n    N9 --\u003e N11\n    N10 --\u003e N11\n    N11 --\u003e N12\n    N13 --\u003e N14\n    N12 --\u003e N13\n    click N2 \"javascript:navigateToFunction('s.CalculateEstimatedDelivery')\"\n    click N9 \"javascript:navigateToFunction('s.generateTrackingNumber')\"\n    click N12 \"javascript:navigateToFunction('s.calculateShippingFee')\"\n",
    "packageName": "service",
    "receiverType": "ShippingService"
  },
  "service.ShippingService.CalculateEstimatedDelivery": {
    "calledFunctions": [
      "time.Now",
      "now.AddDate"
    ],
    "comments": "CalculateEstimatedDelivery 配送予定日を計算",
    "fileName": "application/service/shipping.go",
    "fullName": "service.ShippingService.CalculateEstimatedDelivery",
    "functionName": "CalculateEstimatedDelivery",
    "mermaidCode": "flowchart TD\n    N1([\"`**ShippingService.CalculateEstimatedDelivery**`\"])\n    N2[\"now := time.Now()\"]\n    N1 --\u003e N2\n    click N2 \"javascript:navigateToFunction('time.Now')\"\n",
    "packageName": "service",
    "receiverType": "ShippingService"
  },
  "service.ShippingService.UpdateShippingStatus": {
    "calledFunctions": [
      "time.Now"
    ],
    "comments": "UpdateShippingStatus 配送ステータスを更新",
    "fileName": "application/service/shipping.go",
    "fullName": "service.ShippingService.UpdateShippingStatus",
    "functionName": "UpdateShippingStatus",
    "mermaidCode": "flowchart TD\n    N1([\"`**ShippingService.UpdateShippingStatus**`\"])\n    N2([\"return nil\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "service",
    "receiverType": "ShippingService"
  },
  "service.ShippingService.calculateShippingFee": {
    "calledFunctions": [
      "cart.GetTotalAmount",
      "cart.GetTotalWeight"
    ],
    "comments": "calculateShippingFee 配送料を計算",
    "fileName": "application/service/shipping.go",
    "fullName": "service.ShippingService.calculateShippingFee",
    "functionName": "calculateShippingFee",
    "mermaidCode": "flowchart TD\n    N1([\"`**ShippingService.calculateShippingFee**`\"])\n    N2{{\"店舗受取は無料\\nmethod == entity.ShippingMethodPickup\"}}\n    N3([\"return 0\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7{{\"一定金額以上で送料無料\\ncart.GetTotalAmount() \\\u003e= FreeShippingThreshold\"}}\n    N8([\"return 0\"])\n    N9((\"終了\"))\n    N10[\"処理続行\"]\n    N11[\"合流点\"]\n    N12[\"基本配送料\\nbaseFee := StandardShippingFee\"]\n    N13{{\"method == entity.ShippingMethodExpress\"}}\n    N14[\"baseFee = ExpressShippingFee\"]\n    N15[\"処理続行\"]\n    N16[\"合流点\"]\n    N17{{\"重量による追加料金\\ncart.GetTotalWeight() \\\u003e= HeavyWeightThreshold\"}}\n    N18[\"baseFee += HeavyWeightFee\"]\n    N19[\"処理続行\"]\n    N20[\"合流点\"]\n    N21([\"return baseFee\"])\n    N22((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N8 --\u003e N9\n    N7 --\u003e |Yes| N8\n    N7 --\u003e |No| N10\n    N10 --\u003e N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e |Yes| N14\n    N13 --\u003e |No| N15\n    N14 --\u003e N16\n    N15 --\u003e N16\n    N16 --\u003e N17\n    N17 --\u003e |Yes| N18\n    N17 --\u003e |No| N19\n    N18 --\u003e N20\n    N19 --\u003e N20\n    N21 --\u003e N22\n    N20 --\u003e N21\n    click N7 \"javascript:navigateToFunction('cart.GetTotalAmount')\"\n    click N17 \"javascript:navigateToFunction('cart.GetTotalWeight')\"\n",
    "packageName": "service",
    "receiverType": "ShippingService"
  },
  "service.ShippingService.generateTrackingNumber": {
    "calledFunctions": [
      "String",
      "uuid.New"
    ],
    "comments": "generateTrackingNumber 追跡番号を生成（モック）",
    "fileName": "application/service/shipping.go",
    "fullName": "service.ShippingService.generateTrackingNumber",
    "functionName": "generateTrackingNumber",
    "mermaidCode": "flowchart TD\n    N1([\"`**ShippingService.generateTrackingNumber**`\"])\n    N2[\"prefix := #quot;STD#quot;\"]\n    N3([\"return prefix + #quot;-#quot; + \"])\n    N4((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e N3\n    click N3 \"javascript:navigateToFunction('uuid.New')\"\n",
    "packageName": "service",
    "receiverType": "ShippingService"
  },
  "usecase.NewOrderCreateUseCase": {
    "calledFunctions": null,
    "comments": "NewOrderCreateUseCase コンストラクタ",
    "fileName": "application/usecase/order_create.go",
    "fullName": "usecase.NewOrderCreateUseCase",
    "functionName": "NewOrderCreateUseCase",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewOrderCreateUseCase**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "usecase",
    "receiverType": ""
  },
  "usecase.NewOrderRefundUseCase": {
    "calledFunctions": null,
    "comments": "NewOrderRefundUseCase コンストラクタ",
    "fileName": "application/usecase/order_refund.go",
    "fullName": "usecase.NewOrderRefundUseCase",
    "functionName": "NewOrderRefundUseCase",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewOrderRefundUseCase**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "usecase",
    "receiverType": ""
  },
  "usecase.NewOrderStatusUseCase": {
    "calledFunctions": null,
    "comments": "NewOrderStatusUseCase コンストラクタ",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.NewOrderStatusUseCase",
    "functionName": "NewOrderStatusUseCase",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewOrderStatusUseCase**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "usecase",
    "receiverType": ""
  },
  "usecase.OrderCreateUseCase.CreateOrder": {
    "calledFunctions": [
      "uc.orderValidator.ValidateCreateOrder",
      "uc.customerRepo.GetByID",
      "uc.cartService.GetCart",
      "uc.cartService.ValidateCartItems",
      "uc.inventoryService.ReserveStock",
      "uc.pricingService.Calculate",
      "uc.inventoryService.ReleaseStock",
      "uc.couponService.ValidateCoupon",
      "uc.couponService.ApplyCoupon",
      "uc.paymentService.ProcessPayment",
      "uc.shippingService.ArrangeShipping",
      "time.Now",
      "uc.orderRepo.Create",
      "uc.inventoryService.CommitStock",
      "uc.couponService.UseCoupon",
      "uc.cartService.ClearCart",
      "uc.notificationService.SendOrderConfirmation"
    ],
    "comments": "CreateOrder 注文を作成する",
    "fileName": "application/usecase/order_create.go",
    "fullName": "usecase.OrderCreateUseCase.CreateOrder",
    "functionName": "CreateOrder",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderCreateUseCase.CreateOrder**`\"])\n    N2{{\"1. リクエストのバリデーション\\nerr != nil\"}}\n    N3([\"return nil, err\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"2. 顧客情報を取得\\ncustomer, err := uc.customerRepo.GetByID(ctx, req.CustomerID)\"]\n    N8{{\"err != nil\"}}\n    N9([\"return nil, err\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13[\"3. カート情報を取得\\ncart, err := uc.cartService.GetCart(ctx, req.CartID)\"]\n    N14{{\"err != nil\"}}\n    N15([\"return nil, err\"])\n    N16((\"終了\"))\n    N17[\"処理続行\"]\n    N18[\"合流点\"]\n    N19{{\"4. カートアイテムの有効性を検証\\nerr != nil\"}}\n    N20([\"return nil, err\"])\n    N21((\"終了\"))\n    N22[\"処理続行\"]\n    N23[\"合流点\"]\n    N24{{\"5. 在庫を予約（引当）\\nerr != nil\"}}\n    N25([\"return nil, err\"])\n    N26((\"終了\"))\n    N27[\"処理続行\"]\n    N28[\"合流点\"]\n    N29[\"6. 価格を計算\\npricing, err := uc.pricingService.Calculate(ctx, cart, customer, req.ShippingMethod)\"]\n    N30{{\"err != nil\"}}\n    N31[\"在庫を解放\\nuc.inventoryService.ReleaseStock(ctx, cart.Items)\"]\n    N32([\"return nil, err\"])\n    N33((\"終了\"))\n    N34[\"処理続行\"]\n    N35[\"合流点\"]\n    N36{{\"req.CouponCode != #quot;#quot;\"}}\n    N37[\"coupon, err := uc.couponService.ValidateCoupon(ctx, req.CouponCode, cart, customer)\"]\n    N38{{\"err != nil\"}}\n    N39[\"uc.inventoryService.ReleaseStock(ctx, cart.Items)\"]\n    N40([\"return nil, err\"])\n    N41((\"終了\"))\n    N42[\"処理続行\"]\n    N43{{\"err != nil\"}}\n    N44[\"uc.inventoryService.ReleaseStock(ctx, cart.Items)\"]\n    N45([\"return nil, err\"])\n    N46((\"終了\"))\n    N47[\"処理続行\"]\n    N48[\"appliedCoupon = coupon\"]\n    N49[\"処理続行\"]\n    N50[\"合流点\"]\n    N51[\"8. 決済を処理\\npayment, err := uc.paymentService.ProcessPayment(ctx, pricing, req.PaymentMethod, req.PointsToUse, customer)\"]\n    N52{{\"err != nil\"}}\n    N53[\"在庫を解放\\nuc.inventoryService.ReleaseStock(ctx, cart.Items)\"]\n    N54([\"return nil, err\"])\n    N55((\"終了\"))\n    N56[\"処理続行\"]\n    N57[\"合流点\"]\n    N58[\"9. 配送を手配\\nshipping, err := uc.shippingService.ArrangeShipping(ctx, req.ShippingMethod, req.ShippingAddress, cart)\"]\n    N59{{\"err != nil\"}}\n    N60[\"決済をキャンセル（実際にはPaymentServiceにキャンセルメソッドが必要）\\nuc.inventoryService.ReleaseStock(ctx, cart.Items)\"]\n    N61([\"return nil, err\"])\n    N62((\"終了\"))\n    N63[\"処理続行\"]\n    N64[\"合流点\"]\n    N65[\"10. 注文を作成\\norder := \u0026\"]\n    N66{{\"11. 注文を保存\\nerr != nil\"}}\n    N67[\"ロールバック処理\\nuc.inventoryService.ReleaseStock(ctx, cart.Items)\"]\n    N68([\"return nil, err\"])\n    N69((\"終了\"))\n    N70[\"処理続行\"]\n    N71[\"合流点\"]\n    N72[\"決済情報に注文IDを設定\\npayment.OrderID = order.ID\"]\n    N73{{\"12. 在庫を確定\\nerr != nil\"}}\n    N74([\"注文は作成されているが、在庫確定に失敗\\n実際にはアラートを発行するなどの対応が必要\\nreturn nil, err\"])\n    N75((\"終了\"))\n    N76[\"処理続行\"]\n    N77[\"合流点\"]\n    N78{{\"13. クーポンを使用済みにする\\nappliedCoupon != nil\"}}\n    N79{{\"err != nil\"}}\n    N80[\"処理続行\"]\n    N81[\"処理続行\"]\n    N82[\"合流点\"]\n    N83{{\"14. カートをクリア\\nerr != nil\"}}\n    N84[\"処理続行\"]\n    N85[\"合流点\"]\n    N86([\"return order, nil\"])\n    N87((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N15 --\u003e N16\n    N14 --\u003e |Yes| N15\n    N14 --\u003e |No| N17\n    N17 --\u003e N18\n    N18 --\u003e N19\n    N20 --\u003e N21\n    N19 --\u003e |Yes| N20\n    N19 --\u003e |No| N22\n    N22 --\u003e N23\n    N23 --\u003e N24\n    N25 --\u003e N26\n    N24 --\u003e |Yes| N25\n    N24 --\u003e |No| N27\n    N27 --\u003e N28\n    N28 --\u003e N29\n    N29 --\u003e N30\n    N32 --\u003e N33\n    N31 --\u003e N32\n    N30 --\u003e |Yes| N31\n    N30 --\u003e |No| N34\n    N34 --\u003e N35\n    N35 --\u003e N36\n    N37 --\u003e N38\n    N40 --\u003e N41\n    N39 --\u003e N40\n    N38 --\u003e |Yes| N39\n    N38 --\u003e |No| N42\n    N42 --\u003e N43\n    N45 --\u003e N46\n    N44 --\u003e N45\n    N43 --\u003e |Yes| N44\n    N43 --\u003e |No| N47\n    N47 --\u003e N48\n    N36 --\u003e |Yes| N37\n    N36 --\u003e |No| N49\n    N48 --\u003e N50\n    N49 --\u003e N50\n    N50 --\u003e N51\n    N51 --\u003e N52\n    N54 --\u003e N55\n    N53 --\u003e N54\n    N52 --\u003e |Yes| N53\n    N52 --\u003e |No| N56\n    N56 --\u003e N57\n    N57 --\u003e N58\n    N58 --\u003e N59\n    N61 --\u003e N62\n    N60 --\u003e N61\n    N59 --\u003e |Yes| N60\n    N59 --\u003e |No| N63\n    N63 --\u003e N64\n    N64 --\u003e N65\n    N65 --\u003e N66\n    N68 --\u003e N69\n    N67 --\u003e N68\n    N66 --\u003e |Yes| N67\n    N66 --\u003e |No| N70\n    N70 --\u003e N71\n    N71 --\u003e N72\n    N72 --\u003e N73\n    N74 --\u003e N75\n    N73 --\u003e |Yes| N74\n    N73 --\u003e |No| N76\n    N76 --\u003e N77\n    N77 --\u003e N78\n    N79 --\u003e |No| N80\n    N78 --\u003e |Yes| N79\n    N78 --\u003e |No| N81\n    N80 --\u003e N82\n    N81 --\u003e N82\n    N82 --\u003e N83\n    N83 --\u003e |No| N84\n    N83 --\u003e N85\n    N84 --\u003e N85\n    N86 --\u003e N87\n    N85 --\u003e N86\n    click N37 \"javascript:navigateToFunction('uc.couponService.ValidateCoupon')\"\n    click N58 \"javascript:navigateToFunction('uc.shippingService.ArrangeShipping')\"\n    click N60 \"javascript:navigateToFunction('uc.inventoryService.ReleaseStock')\"\n    click N7 \"javascript:navigateToFunction('uc.customerRepo.GetByID')\"\n    click N44 \"javascript:navigateToFunction('uc.inventoryService.ReleaseStock')\"\n    click N53 \"javascript:navigateToFunction('uc.inventoryService.ReleaseStock')\"\n    click N65 \"javascript:navigateToFunction('time.Now')\"\n    click N13 \"javascript:navigateToFunction('uc.cartService.GetCart')\"\n    click N51 \"javascript:navigateToFunction('uc.paymentService.ProcessPayment')\"\n    click N29 \"javascript:navigateToFunction('uc.pricingService.Calculate')\"\n    click N39 \"javascript:navigateToFunction('uc.inventoryService.ReleaseStock')\"\n    click N67 \"javascript:navigateToFunction('uc.inventoryService.ReleaseStock')\"\n    click N31 \"javascript:navigateToFunction('uc.inventoryService.ReleaseStock')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderCreateUseCase"
  },
  "usecase.OrderRefundUseCase.RefundOrder": {
    "calledFunctions": [
      "uc.orderValidator.ValidateRefund",
      "uc.orderRepo.GetByID",
      "order.CanRefund",
      "uc.customerRepo.GetByID",
      "uc.paymentService.RefundPayment",
      "len",
      "uc.inventoryService.RestoreStock",
      "time.Now",
      "uc.orderRepo.Update",
      "uc.notificationService.SendRefundNotification"
    ],
    "comments": "RefundOrder 注文を返金する",
    "fileName": "application/usecase/order_refund.go",
    "fullName": "usecase.OrderRefundUseCase.RefundOrder",
    "functionName": "RefundOrder",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderRefundUseCase.RefundOrder**`\"])\n    N2{{\"1. リクエストのバリデーション\\nerr != nil\"}}\n    N3([\"return nil, err\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"2. 注文を取得\\norder, err := uc.orderRepo.GetByID(ctx, req.OrderID)\"]\n    N8{{\"err != nil\"}}\n    N9([\"return nil, err\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12[\"合流点\"]\n    N13{{\"3. 返金可能かチェック\\n!order.CanRefund()\"}}\n    N14([\"return nil, \u0026\"])\n    N15((\"終了\"))\n    N16[\"処理続行\"]\n    N17[\"合流点\"]\n    N18[\"4. 顧客情報を取得\\ncustomer, err := uc.customerRepo.GetByID(ctx, order.CustomerID)\"]\n    N19{{\"err != nil\"}}\n    N20([\"return nil, err\"])\n    N21((\"終了\"))\n    N22[\"処理続行\"]\n    N23[\"合流点\"]\n    N24{{\"5. 決済情報のチェック\\norder.Payment == nil\"}}\n    N25([\"return nil, \u0026\"])\n    N26((\"終了\"))\n    N27[\"処理続行\"]\n    N28[\"合流点\"]\n    N29{{\"6. 決済の返金処理\\nerr != nil\"}}\n    N30([\"return nil, err\"])\n    N31((\"終了\"))\n    N32[\"処理続行\"]\n    N33[\"合流点\"]\n    N34{{\"7. 在庫を復元\\norder.Cart != nil \u0026\u0026 len(order.Cart.Items) \\\u003e 0\"}}\n    N35{{\"err != nil\"}}\n    N36[\"処理続行\"]\n    N37[\"処理続行\"]\n    N38[\"合流点\"]\n    N39[\"8. 注文ステータスを更新\\norder.Status = entity.OrderStatusRefunded\"]\n    N40[\"order.CancelledAt = time.Now()\"]\n    N41[\"order.CancelReason = req.Reason\"]\n    N42{{\"9. 注文を保存\\nerr != nil\"}}\n    N43([\"return nil, err\"])\n    N44((\"終了\"))\n    N45[\"処理続行\"]\n    N46[\"合流点\"]\n    N47([\"return order, nil\"])\n    N48((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N12 --\u003e N13\n    N14 --\u003e N15\n    N13 --\u003e |Yes| N14\n    N13 --\u003e |No| N16\n    N16 --\u003e N17\n    N17 --\u003e N18\n    N18 --\u003e N19\n    N20 --\u003e N21\n    N19 --\u003e |Yes| N20\n    N19 --\u003e |No| N22\n    N22 --\u003e N23\n    N23 --\u003e N24\n    N25 --\u003e N26\n    N24 --\u003e |Yes| N25\n    N24 --\u003e |No| N27\n    N27 --\u003e N28\n    N28 --\u003e N29\n    N30 --\u003e N31\n    N29 --\u003e |Yes| N30\n    N29 --\u003e |No| N32\n    N32 --\u003e N33\n    N33 --\u003e N34\n    N35 --\u003e |No| N36\n    N34 --\u003e |Yes| N35\n    N34 --\u003e |No| N37\n    N36 --\u003e N38\n    N37 --\u003e N38\n    N38 --\u003e N39\n    N39 --\u003e N40\n    N40 --\u003e N41\n    N41 --\u003e N42\n    N43 --\u003e N44\n    N42 --\u003e |Yes| N43\n    N42 --\u003e |No| N45\n    N45 --\u003e N46\n    N47 --\u003e N48\n    N46 --\u003e N47\n    click N40 \"javascript:navigateToFunction('time.Now')\"\n    click N7 \"javascript:navigateToFunction('uc.orderRepo.GetByID')\"\n    click N13 \"javascript:navigateToFunction('order.CanRefund')\"\n    click N18 \"javascript:navigateToFunction('uc.customerRepo.GetByID')\"\n    click N34 \"javascript:navigateToFunction('len')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderRefundUseCase"
  },
  "usecase.OrderStatusUseCase.GetCustomerOrders": {
    "calledFunctions": [
      "uc.customerRepo.GetByID",
      "uc.orderRepo.GetByCustomerID",
      "make",
      "len",
      "uc.buildStatusResponse",
      "append"
    ],
    "comments": "GetCustomerOrders 顧客の注文一覧を取得する",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.GetCustomerOrders",
    "functionName": "GetCustomerOrders",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.GetCustomerOrders**`\"])\n    N2[\"1. 顧客の存在確認\\n_, err := uc.customerRepo.GetByID(ctx, customerID)\"]\n    N3{{\"err != nil\"}}\n    N4([\"return nil, err\"])\n    N5((\"終了\"))\n    N6[\"処理続行\"]\n    N7[\"合流点\"]\n    N8[\"2. 注文一覧を取得\\norders, err := uc.orderRepo.GetByCustomerID(ctx, customerID)\"]\n    N9{{\"err != nil\"}}\n    N10([\"return nil, err\"])\n    N11((\"終了\"))\n    N12[\"処理続行\"]\n    N13[\"合流点\"]\n    N14[\"3. レスポンスを作成\\nresponses := make(, 0, len(orders))\"]\n    N15{{\"for _, order := range orders\"}}\n    N16[\"response := uc.buildStatusResponse(order)\"]\n    N17[\"responses = append(responses, response)\"]\n    N18([\"return responses, nil\"])\n    N19((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N8 --\u003e N9\n    N10 --\u003e N11\n    N9 --\u003e |Yes| N10\n    N9 --\u003e |No| N12\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N14 --\u003e N15\n    N16 --\u003e N17\n    N15 --\u003e |Body| N16\n    N17 --\u003e N15\n    N18 --\u003e N19\n    N15 --\u003e N18\n    click N17 \"javascript:navigateToFunction('append')\"\n    click N2 \"javascript:navigateToFunction('uc.customerRepo.GetByID')\"\n    click N8 \"javascript:navigateToFunction('uc.orderRepo.GetByCustomerID')\"\n    click N14 \"javascript:navigateToFunction('len')\"\n    click N16 \"javascript:navigateToFunction('uc.buildStatusResponse')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "usecase.OrderStatusUseCase.GetOrderStatus": {
    "calledFunctions": [
      "uc.orderRepo.GetByID",
      "uc.buildStatusResponse"
    ],
    "comments": "GetOrderStatus 注文ステータスを取得する",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.GetOrderStatus",
    "functionName": "GetOrderStatus",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.GetOrderStatus**`\"])\n    N2[\"1. 注文を取得\\norder, err := uc.orderRepo.GetByID(ctx, orderID)\"]\n    N3{{\"err != nil\"}}\n    N4([\"return nil, err\"])\n    N5((\"終了\"))\n    N6[\"処理続行\"]\n    N7[\"合流点\"]\n    N8[\"2. ステータスレスポンスを作成\\nresponse := uc.buildStatusResponse(order)\"]\n    N9([\"return response, nil\"])\n    N10((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N4 --\u003e N5\n    N3 --\u003e |Yes| N4\n    N3 --\u003e |No| N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e N9\n    click N8 \"javascript:navigateToFunction('uc.buildStatusResponse')\"\n    click N2 \"javascript:navigateToFunction('uc.orderRepo.GetByID')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "usecase.OrderStatusUseCase.buildStatusResponse": {
    "calledFunctions": [
      "order.GetOrderSummary",
      "order.CanCancel",
      "order.CanRefund",
      "uc.getNextActions",
      "uc.getStatusMessage",
      "uc.buildTrackingInfo"
    ],
    "comments": "buildStatusResponse ステータスレスポンスを作成する",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.buildStatusResponse",
    "functionName": "buildStatusResponse",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.buildStatusResponse**`\"])\n    N2[\"response := \u0026\"]\n    N3[\"ステータスメッセージを設定\\nresponse.StatusMessage = uc.getStatusMessage(order.Status)\"]\n    N4{{\"追跡情報を設定\\norder.Shipping != nil \u0026\u0026 order.Shipping.TrackingNumber != #quot;#quot;\"}}\n    N5[\"response.TrackingInfo = uc.buildTrackingInfo(order)\"]\n    N6[\"処理続行\"]\n    N7[\"合流点\"]\n    N8([\"return response\"])\n    N9((\"終了\"))\n    N1 --\u003e N2\n    N2 --\u003e N3\n    N3 --\u003e N4\n    N4 --\u003e |Yes| N5\n    N4 --\u003e |No| N6\n    N5 --\u003e N7\n    N6 --\u003e N7\n    N8 --\u003e N9\n    N7 --\u003e N8\n    click N2 \"javascript:navigateToFunction('uc.getNextActions')\"\n    click N3 \"javascript:navigateToFunction('uc.getStatusMessage')\"\n    click N5 \"javascript:navigateToFunction('uc.buildTrackingInfo')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "usecase.OrderStatusUseCase.buildTrackingInfo": {
    "calledFunctions": [
      "uc.getCarrierName",
      "order.Shipping.IsDelivered",
      "order.Shipping.ShippedAt.IsZero",
      "order.Shipping.EstimatedDate.Format"
    ],
    "comments": "buildTrackingInfo 追跡情報を作成",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.buildTrackingInfo",
    "functionName": "buildTrackingInfo",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.buildTrackingInfo**`\"])\n    N2{{\"order.Shipping == nil\"}}\n    N3([\"return nil\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7[\"info := \u0026\"]\n    N8{{\"配送ステータスを判定\\norder.Shipping.IsDelivered()\"}}\n    N9[\"info.Status = #quot;delivered#quot;\"]\n    N10[\"info.CurrentStatus = #quot;配送完了#quot;\"]\n    N11{{\"!order.Shipping.ShippedAt.IsZero()\"}}\n    N12[\"info.Status = #quot;in_transit#quot;\"]\n    N13[\"info.CurrentStatus = #quot;配送中#quot;\"]\n    N14[\"info.EstimatedDate = order.Shipping.EstimatedDate.Format(#quot;2006/01/02#quot;)\"]\n    N15[\"info.Status = #quot;preparing#quot;\"]\n    N16[\"info.CurrentStatus = #quot;発送準備中#quot;\"]\n    N17[\"info.EstimatedDate = order.Shipping.EstimatedDate.Format(#quot;2006/01/02#quot;)\"]\n    N18[\"合流点\"]\n    N19([\"return info\"])\n    N20((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N7 --\u003e N8\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N12 --\u003e N13\n    N13 --\u003e N14\n    N11 --\u003e |Yes| N12\n    N15 --\u003e N16\n    N16 --\u003e N17\n    N8 --\u003e |No| N11\n    N10 --\u003e N18\n    N17 --\u003e N18\n    N19 --\u003e N20\n    N18 --\u003e N19\n    click N14 \"javascript:navigateToFunction('order.Shipping.EstimatedDate.Format')\"\n    click N17 \"javascript:navigateToFunction('order.Shipping.EstimatedDate.Format')\"\n    click N7 \"javascript:navigateToFunction('uc.getCarrierName')\"\n    click N8 \"javascript:navigateToFunction('order.Shipping.IsDelivered')\"\n    click N11 \"javascript:navigateToFunction('order.Shipping.ShippedAt.IsZero')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "usecase.OrderStatusUseCase.getCarrierName": {
    "calledFunctions": null,
    "comments": "getCarrierName 配送業者名を取得",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.getCarrierName",
    "functionName": "getCarrierName",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.getCarrierName**`\"])\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "usecase.OrderStatusUseCase.getNextActions": {
    "calledFunctions": [
      "make",
      "append",
      "order.CanRefund"
    ],
    "comments": "getNextActions 次に可能なアクションを取得",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.getNextActions",
    "functionName": "getNextActions",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.getNextActions**`\"])\n    N2[\"actions := make(, 0)\"]\n    N3([\"return actions\"])\n    N4((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e N3\n    click N2 \"javascript:navigateToFunction('make')\"\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "usecase.OrderStatusUseCase.getStatusMessage": {
    "calledFunctions": null,
    "comments": "getStatusMessage ステータスに応じたメッセージを取得",
    "fileName": "application/usecase/order_status.go",
    "fullName": "usecase.OrderStatusUseCase.getStatusMessage",
    "functionName": "getStatusMessage",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderStatusUseCase.getStatusMessage**`\"])\n",
    "packageName": "usecase",
    "receiverType": "OrderStatusUseCase"
  },
  "validator.NewOrderValidator": {
    "calledFunctions": null,
    "comments": "NewOrderValidator コンストラクタ",
    "fileName": "application/validator/order.go",
    "fullName": "validator.NewOrderValidator",
    "functionName": "NewOrderValidator",
    "mermaidCode": "flowchart TD\n    N1([\"`**NewOrderValidator**`\"])\n    N2([\"return \u0026\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n",
    "packageName": "validator",
    "receiverType": ""
  },
  "validator.OrderValidator.ValidateCreateOrder": {
    "calledFunctions": [
      "validation.ValidateStruct",
      "validation.Field",
      "validation.Length",
      "validation.In",
      "validation.Min",
      "v.ValidateShippingAddress"
    ],
    "comments": "ValidateCreateOrder 注文作成リクエストのバリデーション",
    "fileName": "application/validator/order.go",
    "fullName": "validator.OrderValidator.ValidateCreateOrder",
    "functionName": "ValidateCreateOrder",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderValidator.ValidateCreateOrder**`\"])\n    N2{{\"基本バリデーション\\nerr != nil\"}}\n    N3([\"return err\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7{{\"店舗受取以外は配送先住所が必須\\nreq.ShippingMethod != entity.ShippingMethodPickup\"}}\n    N8{{\"req.ShippingAddress == nil\"}}\n    N9([\"return \u0026\"])\n    N10((\"終了\"))\n    N11[\"処理続行\"]\n    N12{{\"err != nil\"}}\n    N13([\"return err\"])\n    N14((\"終了\"))\n    N15[\"処理続行\"]\n    N16[\"処理続行\"]\n    N17[\"合流点\"]\n    N18{{\"ポイント決済またはポイント併用の場合、ポイント使用額が必須\\nreq.PaymentMethod == entity.PaymentMethodPoints || req.PaymentMethod == entity.PaymentMethodCombined\"}}\n    N19{{\"req.PointsToUse \\\u003c= 0\"}}\n    N20([\"return \u0026\"])\n    N21((\"終了\"))\n    N22[\"処理続行\"]\n    N23[\"処理続行\"]\n    N24[\"合流点\"]\n    N25([\"return nil\"])\n    N26((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N6 --\u003e N7\n    N9 --\u003e N10\n    N8 --\u003e |Yes| N9\n    N8 --\u003e |No| N11\n    N11 --\u003e N12\n    N13 --\u003e N14\n    N12 --\u003e |Yes| N13\n    N12 --\u003e |No| N15\n    N7 --\u003e |Yes| N8\n    N7 --\u003e |No| N16\n    N15 --\u003e N17\n    N16 --\u003e N17\n    N17 --\u003e N18\n    N20 --\u003e N21\n    N19 --\u003e |Yes| N20\n    N19 --\u003e |No| N22\n    N18 --\u003e |Yes| N19\n    N18 --\u003e |No| N23\n    N22 --\u003e N24\n    N23 --\u003e N24\n    N25 --\u003e N26\n    N24 --\u003e N25\n",
    "packageName": "validator",
    "receiverType": "OrderValidator"
  },
  "validator.OrderValidator.ValidateRefund": {
    "calledFunctions": [
      "validation.ValidateStruct",
      "validation.Field",
      "validation.Length"
    ],
    "comments": "ValidateRefund 返金リクエストのバリデーション",
    "fileName": "application/validator/order.go",
    "fullName": "validator.OrderValidator.ValidateRefund",
    "functionName": "ValidateRefund",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderValidator.ValidateRefund**`\"])\n    N2([\"return validation.ValidateStruct(\u0026req, validation.Field(\u0026req.OrderID, validation.Required, validation.Length(1, 100)), validation.Field(\u0026req.Reason, validation.Required, validation.Length(1, 500)))\"])\n    N3((\"終了\"))\n    N2 --\u003e N3\n    N1 --\u003e N2\n    click N2 \"javascript:navigateToFunction('validation.Length')\"\n",
    "packageName": "validator",
    "receiverType": "OrderValidator"
  },
  "validator.OrderValidator.ValidateShippingAddress": {
    "calledFunctions": [
      "validation.ValidateStruct",
      "validation.Field",
      "validation.Length"
    ],
    "comments": "ValidateShippingAddress 配送先住所のバリデーション",
    "fileName": "application/validator/order.go",
    "fullName": "validator.OrderValidator.ValidateShippingAddress",
    "functionName": "ValidateShippingAddress",
    "mermaidCode": "flowchart TD\n    N1([\"`**OrderValidator.ValidateShippingAddress**`\"])\n    N2{{\"addr == nil\"}}\n    N3([\"return \u0026\"])\n    N4((\"終了\"))\n    N5[\"処理続行\"]\n    N6[\"合流点\"]\n    N7([\"return validation.ValidateStruct(addr, validation.Field(\u0026addr.PostalCode, validation.Required, validation.Length(7, 8)), validation.Field(\u0026addr.Prefecture, validation.Required, validation.Length(2, 4)), validation.Field(\u0026addr.City, validation.Required, validation.Length(1, 100)), validation.Field(\u0026addr.AddressLine1, validation.Required, validation.Length(1, 200)), validation.Field(\u0026addr.AddressLine2, validation.Length(0, 200)), validation.Field(\u0026addr.PhoneNumber, validation.Required, validation.Length(10, 15)), validation.Field(\u0026addr.RecipientName, validation.Required, validation.Length(1, 100)))\"])\n    N8((\"終了\"))\n    N1 --\u003e N2\n    N3 --\u003e N4\n    N2 --\u003e |Yes| N3\n    N2 --\u003e |No| N5\n    N5 --\u003e N6\n    N7 --\u003e N8\n    N6 --\u003e N7\n    click N7 \"javascript:navigateToFunction('validation.Length')\"\n",
    "packageName": "validator",
    "receiverType": "OrderValidator"
  }
};