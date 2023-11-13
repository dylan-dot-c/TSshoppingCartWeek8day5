type ShopUser = {
    name: string;
    age: number;
};
declare class Item {
    private _name;
    private _price;
    private readonly _id;
    private _description;
    private _image_url;
    constructor(_name: string, _price: number, image_url: string, description: string);
    get id(): string;
    get name(): string;
    set name(value: string);
    get price(): number;
    set price(value: number);
    get description(): string;
    set description(value: string);
    get image_url(): string;
    set image_url(value: string);
}
declare class Shop {
    shoppingCartDisplay: HTMLElement;
    fullNameInput: HTMLInputElement | null;
    shopScreen: HTMLElement;
    ageInput: HTMLInputElement | null;
    submitButton: HTMLElement | null;
    formElement: HTMLElement;
    private _user;
    itemsShowcase: HTMLElement;
    itemCount: number;
    cartCountItems: HTMLElement;
    private readonly _items;
    get items(): Item[];
    constructor();
    addEventListeners(): void;
    cartHTMLElement(): void;
    updateCount(): void;
    showItems(): void;
    render(): void;
    showCurrentItems(currentItems: Item[]): void;
    addRemoveEventListeners(): void;
    getCartQuantity(): Record<string, number>;
    generateItems(): Item[];
    get user(): ShopUser;
    loginUser(name: string, age: number): void;
}
declare class User {
    private _name;
    private _age;
    private _cart;
    constructor(_name: string, _age: number, cart: Item[]);
    static loginInUser(name: string, age: number): User;
    addToCart(item: Item): void;
    getCartQuantity(): Record<string, number>;
    cartHTMLElement(): HTMLElement;
    removeFromCart(itemToRemove: Item): void;
    removeQuantityFromCart(itemToRemove: Item, count: number): void;
    addRemoveEventListeners(): void;
    cartTotal(): number;
    printCart(): void;
    get cart(): Item[];
    set cart(value: Item[]);
    get age(): number;
    set age(value: number);
    get name(): string;
    set name(value: string);
    private readonly _id;
    get id(): string;
}
export { Item, Shop, User };
