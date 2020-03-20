import LocalizedStrings from 'react-native-localization';

export default new LocalizedStrings(
    {
        en: {
            AppName: 'DirectD',

            Exit                   : "Exit",
            ExitConfirm            : "Are you sure you want to exit this app",
            YES                    : "YES",
            OK                     : "OK",
            ViewMyOrders           : "View My Oders",
            CANCEL                 : "CANCEL",
            Confirm                : "Confirm",
            Retry                  : "RETRY",
            PleaseWait             : "Please Wait",
            LogginOut              : "Logging Out...",
            Attention              : "Attention",
            Loading                : "Loading",
            LoginRequired          : "You need to Login to access this service!",
            LogoutConfirmation     : "Are you sure you want to logout!",
            UnknownError           : "Unknown Error!",
            ResponseNotFound       : "Error Response Not Found!",
            OperationCanceledByUser: "Operation canceled by user!",
            SessionExpired         : "Your Session has Expired, Please Login Again!",
            ErrorNotFound          : "Error Not Found!",
            Error                  : "Error!",
            Ok                     : "Ok!",
            Allow                  : "Allow",
            AskMeLater             : "Ask Me Later",
            Permission             : {
                title   : "Permission Request!",
                location: "This app needs location permission to delivery orders to your address!"
            },

            GetCurrentAddress  : "Get Current Address",
            ExitAppConfirmation: "Press back again to exit App.",

            WriteSomethingHere: "write something here",
            HelperTextDefault : "No Message",

            // Scene's Titles
            Home    : "Home",
            Intro   : "Intro",
            Product : "Product",
            WishList: "WishList",

            Restaurants  : "Restaurants",
            Catering     : "Catering",
            Cart         : "Cart",
            MyOrders     : "My Orders",
            MyAddress    : "My Address",
            Reservations : "Reservations",
            Notifications: "Notifications",
            Favorites    : "Favorites",
            Settings     : "Settings",
            RateApp      : "Rate App",
            ShareUs      : "Share Us",
            About        : "About",

            // Home
            products: "products",

            // TopBar
            ShowFilter : "Sub Categories",
            HideFilter : "Hide",
            Sort       : "Sort",
            textFilter : "Recent",
            SelectImage: "Select Image",

            // Category
            ThereIsNoMore: "There is no more product to show",
            PageRefreshed: "Page Refreshed!",

            // Product
            AddtoCart                  : "Add to Cart",
            AddtoWishlist              : "Add to Wishlist",
            ProductVariations          : "Variations",
            NoVariation                : "This product don't have any variation",
            AdditionalInformation      : "Description",
            NoProductDescription       : "No Product Description",
            ProductReviews             : "Reviews",
            NoReview                   : "This product don't have any reviews ...yet",
            BUYNOW                     : "BUY NOW",
            ProductLimitWaring         : "You can't add more than 10 product",
            EmptyProductAttribute      : "This product don't have any attributes",
            ProductFeatures            : "Features",
            ErrorMessageRequest        : "Can't get data from server",
            NoConnection               : "No internet connection",
            RequestFailed              : "HTTP Request Failed",
            ProductRelated             : "You May Also Like",
            FormInvalid                : "Please Check Your Inputs",
            KeyChainStoreFailed        : "Unable to Store Sensitive Data",
            KeyChainRetriveFailed      : "Unable to Retrive Sensitive Data",
            KeyChainResetFailed        : "Unable to Reset Sensitive Data",
            StorageStoreFailed         : "Unable to Store Storage Data",
            StorageRetriveFailed       : "Unable to Retrive Storage Data",
            StorageRemoveFailed        : "Unable to Remove Storage Data",
            StorageClearFailed         : "Unable to Clear Storage Data",
            AndroidPermissionDenied    : "Permission Denied!",
            AndroidPermissionNotGranted: "Permission Not Granted!",
            FirebaseTokenFailed        : "Push Notification might not work, Permission Denied!",
            ImagePickerCanceled        : "Image Picker Canceled!",
            ImagePickerError           : "Error in Image Picker!",
            LoginFailed                : "Login Failed, Please Try Again!",
            LogoutFailed               : "Logout Failed!",
            GeocoderFailed             : "Unable to Retrive Geocoder",
            GPSFailed                  : "Unable to Retrive Current Location",
            GPSPermissionRequest       : "Permission Denied!\nPlease Allow GPS Permission to Allow this App to work properly!",
            DeviceInfoFailed           : "Device Info Fetching Failed!",
            NoHomeItemsFound           : "This place is deserted",
            NoRestaurantFound          : "Seems like there is no restaurants nearby",
            NoCategoryFound            : "Seems like no category found in our vault",
            NoProductFound             : "Seems like no product found in our vault",
            ComingSoon                 : "Currently in works",
            FeaturedProducts           : "Featured Products",
            NewArrivals                : "New Arrivals",

            // Cart
            NoCartItem           : "There is no product in cart",
            Total                : "Total",
            EmptyCheckout        : "Sorry, you can't check out an empty cart",
            RemoveCartItemConfirm: "Remove this product from cart?",
            MyCart               : "Cart",
            Order                : "Order",
            ShoppingCart         : "Shopping Cart",
            ShoppingCartIsEmpty  : "Your Cart is Empty",
            Delivery             : "Delivery",
            AddProductToCart     : "Add a product to the shopping cart",
            TotalPrice           : "Total Price:",
            YourDeliveryInfo     : "Your delivery info:",
            ShopNow              : "Shop Now",
            YourChoice           : "Your wishlist:",
            YourSale             : "Your Sale:",
            SubtotalPrice        : "Subtotal Price:",
            BuyNow               : "Buy Now",
            Items                : "items",
            Item                 : "item",
            ThankYou             : "Thank you",
            FinishOrderCOD       : "You can use to number of order to track shipping status",
            FinishOrder          :
                "Thank you so much for your purchased, to check your delivery status please go to My Orders",
            NextStep             : "Next Step",
            ConfirmOrder         : "Confirm Order",
            RequireEnterAllFileds: "Please enter all fields",
            InvalidEmail         : "Invalid email address",
            Finish               : "Finish",

            // Wishlist
            NoWishListItem           : "There is no item in wishlist",
            MoveAllToCart            : "Add all to cart",
            EmptyWishList            : "Empty wishlist",
            EmptyAddToCart           : "Sorry, the wishlist is empty",
            RemoveWishListItemConfirm: "Remove this product from wishlist?",
            CleanAll                 : "Clean All",

            // Sidemenu
            SignIn                 : "Log In",
            SignOut                : "Log Out",
            GuestAccount           : "Guest Account",
            CantReactEmailError    :
                "We can't reach your email address, please try other login method",
            NoEmailError           : "Your account don't have valid email address",
            EmailIsNotVerifiedError:
                "Your email address is not verified, we can' trust you",
            Shop                   : "Shop",
            News                   : "News",
            Contact                : "Contact us",
            Setting                : "Setting",
            Login                  : "Login",
            Logout                 : "Logout",
            Category               : "Category",

            // Checkout
            Checkout           : "Checkout",
            ProceedPayment     : "Proceed Payment",
            Purchase           : "Purchase",
            CashOnDelivery     : "Cash on Delivery",
            Paypal             : "Paypal",
            Stripe             : "Stripe",
            CreditCard         : "Credit Card",
            PaymentMethod      : "Payment Method - Not select",
            PaymentMethodError : "Please select your payment method",
            PayWithCoD         : "Your purchase will be pay when goods were delivered",
            PayWithPayPal      : "Your purchase will be pay with PayPal",
            PayWithStripe      : "Your purchase will be pay with Stripe",
            ApplyCoupon        : "Apply",
            CouponPlaceholder  : "COUPON CODE",
            APPLY              : "APPLY",
            Back               : "Back",
            CardNamePlaceholder: "Name written on card",
            BackToHome         : "Back to Home",
            OrderCompleted     : "Your order was completed",
            OrderCanceled      : "Your order was canceled",
            OrderFailed        : "Something went wrong...",
            OrderCompletedDesc : "Your order id is ",
            OrderCanceledDesc  :
                "You have canceled the order. The transaction has not been completed",
            OrderFailedDesc    :
                "We have encountered an error while processing your order. The transaction has not been completed. Please try again",
            OrderTip           :
                'Tip: You could track your order status in "My Orders" section from side menu',
            Payment            : "Payment",
            Complete           : "Complete",
            EnterYourFirstName : "Enter your First Name",
            EnterYourLastName  : "Enter your Last Name",
            EnterYourEmail     : "Enter your email",
            EnterYourPhone     : "Enter your phone",
            EnterYourAddress   : "Enter your address",
            CreateOrderError   : "Cannot create new order. Please try again later",
            AccountNumner      : "Account number",
            CardHolderName     : "Cardholder Name",
            ExpirationDate     : "Expiration Date",
            SecurityCode       : "CVV",

            // myorder
            OrderId        : "Order ID",
            MyOrder        : "My Orders",
            NoOrder        : "You don't have any orders",
            OrderDate      : "Order Date: ",
            OrderStatus    : "Status: ",
            OrderPayment   : "Payment method: ",
            OrderTotal     : "Total: ",
            OrderDetails   : "Show detail",
            ShippingAddress: "Shipping Address:",
            Refund         : "Refund",

            // settings
            BASICSETTINGS: "BASIC SETTINGS",
            Language     : "Language",
            INFO         : "INFO",
            changeRTL    : "Switch RTL",

            // language
            AvailableLanguages   : "Available Languages",
            SwitchLanguage       : "Switch Language",
            SwitchLanguageConfirm: "Switch language require an app reload, continue?",
            SwitchRtlConfirm     : "Switch RTL require an app reload, continue?",

            // about us
            AppDescription: "",
            AppContact    : " Contact us at: ",
            AppEmail      : " Email: ",
            AppCopyRights : "© 2020",

            // contact us
            contactus: "Contact us",

            // form
            NotSelected     : "Not selected",
            EmptyError      : "This field is empty",
            DeliveryInfo    : "Delivery Info",
            FirstName       : "First Name",
            LastName        : "Last Name",
            Address         : "Address",
            City            : "Town/City",
            State           : "State",
            NotSelectedError: "Please choose one",
            Postcode        : "Postcode",
            Country         : "Country",
            Email           : "Email",
            Phone           : "Phone Number",
            Note            : "Note",

            // search
            Search           : "Search",
            SearchPlaceHolder: "Search product by name",
            NoResultError    : "Your search keyword did not match any products.",
            Details          : "Details",

            // filter panel
            Categories: "Categories",

            // sign up
            profileDetail : "Profile Details",
            firstName     : "First name",
            lastName      : "Last name",
            accountDetails: "Account Details",
            username      : "Username",
            email         : "Email",
            generatePass  : "Use generate password",
            password      : "Password",
            signup        : "Sign Up",

            // filter panel
            welcomeBack: "Welcome back! ",
            seeAll     : "Show All",

            couponCodeIsExpired: "This coupon code is expired",
            invalidCouponCode  : "This coupon code is invalid",
            remove             : "Remove",
            reload             : "Reload",
            applyCouponSuccess : "Congratulations! Coupon code applied successfully ",

            OutOfStock  : "OUT OF STOCK",
            ShippingType: "Shipping method",

            // Place holder
            TypeFirstName       : "Type your first name",
            TypeLastName        : "Type your last name",
            TypeAddress         : "Type address",
            TypeCity            : "Type your town or city",
            TypeState           : "Type your state",
            TypeNotSelectedError: "Please choose one",
            TypePostcode        : "Type postcode",
            TypeEmail           : "Type email (Ex. acb@gmail.com), ",
            TypePhone           : "Type your phone number",
            TypeNote            : "Note",
            TypeCountry         : "Select country",
            SelectPayment       : "Select Payment method",
            close               : "CLOSE",
            noConnection        : "NO INTERNET ACCESS",

            // user profile screen
            AccountInformations: "Account Informations",
            PushNotification   : "Push notification",
            DarkTheme          : "Dark Theme",
            Privacy            : "Privacy policies",
            SelectCurrency     : "Select currency",
            Name               : "Name",
            Currency           : "Currency",
            Languages          : "Languages",

            GetDataError   : "Can't get data from server",
            UserOrEmail    : "Username or email",
            Or             : "Or",
            FacebookLogin  : "Facebook Login",
            DontHaveAccount: "Don't have an account?",

            // Modal
            Select  : "Select",
            Cancel  : "Cancel",
            LoginNow: "Login Now",
            Guest   : "Guest",

            LanguageName: "English",

            // review
            vendorTitle     : "Vendor",
            comment         : "Leave a review",
            yourcomment     : "Your comment",
            placeComment    :
                "Tell something about your experience or leave a tip for others",
            writeReview     : "Review",
            thanksForReview :
                "Thanks for the review, your content will be verify by the admin and will be published later",
            errInputComment : "Please input your content to submit",
            errRatingComment: "Please rating to submit",
            send            : "Send",

            termsCondition: "Terms & Condition",
            Subtotal      : "Subtotal",
            Discount      : "Discount",
            Shipping      : "Shipping",
            Recents       : "Recents",
            Filters       : "Filters",
            Princing      : "Pricing",
            Filter        : "Filter",
            ClearFilter   : "Clear Filter",
            ProductCatalog: "Product Catalog",
            ProductTags   : "Product Tags",
            AddToAddress  : "Add to Address",
            SMSLogin      : "SMS Login",
            OrderNotes    : 'Order Notes'
        },
        bn: {},
    }
);
