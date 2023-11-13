import { v4 as uuidv4 } from "uuid";

type ShopUser = {
    name: string;
    age: number;
};
class Item {
    // private attributes

    private readonly _id: string;
    private _description: string;
    private _image_url: string;

    constructor(
        private _name: string,
        private _price: number,
        image_url: string,
        description: string
    ) {
        this._id = uuidv4();
        this._image_url = image_url;
        console.log(description);
        this._description = description;
    }

    // getters and setters
    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }

    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    public get image_url(): string {
        return this._image_url;
    }
    public set image_url(value: string) {
        this._image_url = value;
    }
}

// type ShopType = {};

class Shop {
    public shoppingCartDisplay: HTMLElement;
    public fullNameInput: HTMLInputElement | null;
    public shopScreen: HTMLElement;
    public ageInput: HTMLInputElement | null;
    public submitButton: HTMLElement | null;
    public formElement: HTMLElement;
    private _user = new User("", 0, []);
    public itemsShowcase: HTMLElement;
    public itemCount = 0;
    public cartCountItems: HTMLElement;
    private readonly _items: Item[];
    public get items(): Item[] {
        return this._items;
    }
    constructor() {
        this.cartCountItems = document.getElementById(
            "item-count"
        ) as HTMLElement;
        this.shoppingCartDisplay = document.getElementById(
            "currentShoppingCart"
        ) as HTMLElement;
        this.itemsShowcase = document.getElementById(
            "item-showcase"
        ) as HTMLElement;
        this._items = this.generateItems();
        this.shopScreen = document.getElementById("shop-screen") as HTMLElement;
        this.shopScreen.style.display = "none";
        this.formElement = document.getElementById("loginForm") as HTMLElement;
        this.fullNameInput = document.getElementById(
            "fullName"
        ) as HTMLInputElement;
        this.ageInput = document.getElementById("age") as HTMLInputElement;
        this.submitButton = document.getElementById(
            "submitButton"
        ) as HTMLElement;
        console.log("Welcome to Dylans Shop please log in");
        this.addEventListeners();
    }

    // function to add all event listeners to our webpage
    addEventListeners() {
        // event listener to toggle visibility of floated cart
        this.cartCountItems.addEventListener("click", () => {
            this.shoppingCartDisplay.classList.toggle("d-none");
        });

        // function to accept name and age of user and create a new user
        this.submitButton?.addEventListener("click", (e) => {
            e.preventDefault();
            let name = this.fullNameInput?.value;
            let age = this.ageInput?.value;
            if (name && age) {
                this._user = User.loginInUser(name!, parseInt(age!) as number);
                this.formElement.style.display = "none";
                this.shopScreen.style.display = "block";
                console.log(name, age);
            } else {
                alert("Please enter a valid name and age!");
                return;
            }
        });
    }

    cartHTMLElement() {}

    updateCount() {
        this.itemCount = this._user.cart.length;
        this.cartCountItems.innerHTML = this.itemCount + "";
    }

    showItems() {
        this.itemsShowcase.innerHTML = "";
        console.log("Showing Items");
        this.items[0];
        for (let item of this.items) {
            let div = document.createElement("div");
            div.className =
                "col-3 border rounded-2 position-relative pb-5 cart-item";
            div.innerHTML = `
        <img src="${item.image_url}" height="250px" class="w-100 rounded-3 object-fit-cover " />
        <br />
        <div class="px-3">
            
        <div class="d-flex justify-content-between mt-2 align-items-center">
            <h4>${item.name}</h4>
            <span class="badge text-bg-success ">${item.price}</span>
        </div>
        <p>${item.description} </p>
        <div class="">
            <button class="btn btn-warning w-100 mt-2">Add To Cart</button>
        </div>
        </div>
        
        `;
            this.itemsShowcase.append(div);
        }

        let itemDivs = document.querySelectorAll(".cart-item");
        const toastTrigger = document.getElementById("liveToastBtn");
        let toastContent = document.getElementById("toast-body");
        // const toastLiveExample = document.getElementById("liveToast");

        itemDivs.forEach((item, index) => {
            item.addEventListener("click", () => {
                toastTrigger?.click();
                if (toastContent) {
                    toastContent.innerHTML = "";
                    toastContent.innerHTML = `${this.items[index].name} has been added to your cart`;
                }
                console.log(this.items[index]);
                console.log("Hello");
                this._user.addToCart(this.items[index]);
                console.log(this._user.cart, this._user.cartTotal());
                this.render();
            });
        });
    }

    render() {
        this.showItems();
        this.showCurrentItems(this._user.cart);
        this.updateCount();
    }

    showCurrentItems(currentItems: Item[]) {
        let uniqueItems = new Set(currentItems);
        this.shoppingCartDisplay.innerHTML = "";
        let count = this.getCartQuantity();

        // checking if cart is empty
        if (currentItems.length == 0) {
            let div = document.createElement("div");

            div.innerHTML = `
                <h3 class="text-center">Shopping Cart is Empty!</h3>
            `;
            this.shoppingCartDisplay.append(div);
        } else {
            uniqueItems.forEach((item) => {
                let div = document.createElement("div");
                const currentItem = item;

                div.className =
                    "d-flex gap-3 border-bottom border-warning mb-2";
                div.innerHTML = `
                <img src="${
                    currentItem.image_url
                }" class="rounded-2 item-thumbnail" />
                <p>${currentItem.name}</p>
                <p>$${
                    currentItem.price
                } <br/> <span class="remove-one badge text-bg-warning "><i class="bi bi-dash-square-dotted"></i></span><p>
                
                <p>${
                    count[item.id]
                } <br/> <span class="remove-all badge text-bg-danger "><i class="bi bi-trash3"></i></span><p>
                
                `;
                this.shoppingCartDisplay.append(div);
            });
            this.addRemoveEventListeners();
            let totalDiv = document.createElement("div");
            totalDiv.className = "text-warning mt-1 ";
            totalDiv.innerHTML = `Cart Total: $${this._user.cartTotal()}`;
            this.shoppingCartDisplay.append(totalDiv);
        }
    }

    addRemoveEventListeners() {
        const removeOnes = document.querySelectorAll(".remove-one");
        const removeAlls = document.querySelectorAll(".remove-all");
        let cartList = [...new Set(this._user.cart)];

        removeOnes.forEach((remove, index) => {
            remove.addEventListener("click", () => {
                this._user.removeQuantityFromCart(cartList[index], 1);
                this.render();
            });
        });

        removeAlls.forEach((remove, index) => {
            remove.addEventListener("click", () => {
                this._user.removeFromCart(cartList[index]);
                this.render();
            });
        });
    }

    getCartQuantity() {
        const cart = this._user.cart;
        const countArr: Record<string, number> = cart.reduce(
            (acc: Record<string, number>, curr) => {
                acc[curr.id] = (acc[curr.id] || 0) + 1;
                return acc;
            },
            {}
        );
        console.log(countArr);
        return countArr;
    }

    generateItems() {
        let item1 = new Item(
            "Snake Charmers' Python Guide",
            29.99,
            "./python.jpg",
            "Delve into the mystical world of snake charming with Python! Learn the art of understanding and communicating with these fascinating creatures."
        );

        let item2 = new Item(
            "C# Crafting for Puzzle Enthusiasts",
            24.99,
            "./Csharp.jpg",
            "Craft intricate puzzles with C#! Engage your mind in the creation of unique challenges and unravel the secrets hidden within each solution."
        );

        let item3 = new Item(
            "Java Journeys for Adventure Seekers",
            22.49,
            "./java.jpg",
            "Embark on exciting journeys with Java! Explore the wonders of storytelling and adventure creation through the lens of this versatile programming language."
        );

        let item4 = new Item(
            "Swift Symphony for Music Aficionados",
            19.99,
            "swift.jpg",
            "Compose musical symphonies with Swift! Immerse yourself in the world of music creation and experience the joy of orchestrating beautiful melodies."
        );

        let item5 = new Item(
            "Go Language Galactic Exploration",
            27.99,
            "./go.jpg",
            "Embark on a galactic journey with Go! Explore the cosmos of discovery and engage in thrilling adventures, all while learning the language of the universe."
        );

        let item6 = new Item(
            "Ruby on Rails Recipe Delights",
            23.79,
            "./ruby.jpg",
            "Delight in culinary adventures with Ruby on Rails! Uncover a world of tasty recipes and cooking techniques inspired by the artistry of this programming language."
        );

        return [item1, item2, item3, item4, item5, item6];
    }

    public get user(): ShopUser {
        return this._user;
    }

    loginUser(name: string, age: number) {
        let user = new User(name, age, []);
        this._user = user;
        this.shopScreen.style.display = "none";

        console.log(this.user);
    }
}

class User {
    // private attribute
    private _cart: Item[];
    constructor(private _name: string, private _age: number, cart: Item[]) {
        this._id = uuidv4();
        this._cart = cart;
    }

    static loginInUser(name: string, age: number) {
        return new User(name, age, []);
    }
    addToCart(item: Item): void {
        this.cart.push(item);
    }

    getCartQuantity() {
        const cart = this.cart;
        const countArr: Record<string, number> = cart.reduce(
            (acc: Record<string, number>, curr) => {
                acc[curr.id] = (acc[curr.id] || 0) + 1;
                return acc;
            },
            {}
        );
        console.log(countArr);
        return countArr;
    }

    cartHTMLElement(): HTMLElement {
        let uniqueItems = [...new Set(this._cart)];
        // this.shoppingCartDisplay.innerHTML = "";
        let count = this.getCartQuantity();
        let shoppingCartDiv = document.createElement("div");

        // checking if cart is empty
        if (uniqueItems.length == 0) {
            shoppingCartDiv.innerHTML = `
                <h3 class="text-center">Shopping Cart is Empty!</h3>
            `;
            // this.shoppingCartDisplay.append(div);
        } else {
            uniqueItems.forEach((item) => {
                let itemDiv = document.createElement("div");
                const currentItem = item;

                itemDiv.className =
                    "d-flex gap-3 border-bottom border-warning mb-2";
                itemDiv.innerHTML = `
                <img src="${
                    currentItem.image_url
                }" class="rounded-2 item-thumbnail" />
                <p>${currentItem.name}</p>
                <p>$${
                    currentItem.price
                } <br/> <span class="remove-one badge text-bg-warning "><i class="bi bi-dash-square-dotted"></i></span><p>
                
                <p>${
                    count[item.id]
                } <br/> <span class="remove-all badge text-bg-danger "><i class="bi bi-trash3"></i></span><p>
                
                `;
                shoppingCartDiv.append(itemDiv);
            });
            this.addRemoveEventListeners();
            let totalDiv = document.createElement("div");
            totalDiv.className = "text-warning mt-1 ";
            totalDiv.innerHTML = `Cart Total: $${this.cartTotal()}`;
            shoppingCartDiv.append(totalDiv);
        }

        return shoppingCartDiv;
    }

    removeFromCart(itemToRemove: Item): void {
        const filteredCart = this.cart.filter(
            (item) => item.id != itemToRemove.id
        );
        this.cart = [...filteredCart];
    }

    removeQuantityFromCart(itemToRemove: Item, count: number) {
        const newCart: Item[] = [];
        let removeCount = count;
        for (let itemCart of this.cart) {
            if (itemCart.id === itemToRemove.id && removeCount > 0) {
                removeCount -= 1;
                continue;
            } else {
                newCart.push(itemCart);
            }
        }

        this.cart = [...newCart];
    }

    addRemoveEventListeners() {
        const removeOnes = document.querySelectorAll(".remove-one");
        const removeAlls = document.querySelectorAll(".remove-all");
        let cartList = [...new Set(this.cart)];

        removeOnes.forEach((remove, index) => {
            remove.addEventListener("click", () => {
                this.removeQuantityFromCart(cartList[index], 1);
                // .render();
            });
        });

        removeAlls.forEach((remove, index) => {
            remove.addEventListener("click", () => {
                this.removeFromCart(cartList[index]);
                // this.render();
            });
        });
    }

    cartTotal(): number {
        let total = 0;
        for (let item of this.cart) {
            total += item.price;
        }

        return Number(total.toFixed(2));
    }

    printCart() {
        console.table(this.cart);
    }

    public get cart(): Item[] {
        return this._cart;
    }
    public set cart(value: Item[]) {
        this._cart = value;
    }
    public get age(): number {
        return this._age;
    }
    public set age(value: number) {
        this._age = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private readonly _id: string;
    public get id(): string {
        return this._id;
    }
}

export { Item, Shop, User };
