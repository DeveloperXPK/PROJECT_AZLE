import {
    Canister,
    Err,
    int,
    int32,
    Ok,
    Opt,
    Principal,
    query,
    Record,
    Result,
    StableBTreeMap,
    text,
    update,
    Variant,
    Vec
} from 'azle';

const User = Record({
    id: Principal,
    nombre: text,
    direccion: text,
    telefono: text
});
type User = typeof User.tsType;

const Product = Record({
    id_Producto:Principal,
    nombre_Producto:text,
    fabricante_Producto:text,
    precio_Producto:text
})

type Product = typeof Product.tsType;

const AplicationError = Variant({
    UserDoesNotExist: text,
    productDoesNotExist: text
});

type AplicationError = typeof AplicationError.tsType;

let users = StableBTreeMap<Principal, User>(0);
let products = StableBTreeMap<Principal,Product>(1);

export default Canister({
    
    createUser: update([text, text, text], User, (nombre, direccion, telefono) => {
        const id = generateId();
        const user: User = {
            id:id,
            nombre: nombre,
            direccion: direccion,
            telefono: telefono
        };

        users.insert(user.id, user);

        return user;
    }),
    readUsers: query([], Vec(User), () => {
        return users.values();
    }),
    readUserById: query([text], Opt(User), (id) => {
        return users.get(Principal.fromText(id));
    }),

    deleteUser: update([text], Result(User, AplicationError), (id) => {
        const userOpt = users.get(Principal.fromText(id));

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: id
            });
        }

        const user = userOpt.Some;
        users.remove(user.id);
        return Ok(user);
    }),
    updateUser: update(
        [text, text, text, text],
        Result(User, AplicationError),
        (userId, nombre, direccion, telefono) => {
            const userOpt = users.get(Principal.fromText(userId));

            if ('None' in userOpt) {
                return Err({
                    UserDoesNotExist: userId
                });
            }
            const newUser: User = {
                id:Principal.fromText(userId),
                nombre: nombre,
                direccion: direccion,
                telefono: telefono
            };

            users.remove(Principal.fromText(userId))
            users.insert(Principal.fromText(userId), newUser);

            return Ok(newUser);
        }
    ),

    createProduct: update([text, text, text], Product, (nombre_Producto, fabricante_Producto, precio_Producto) => {
        const id_Producto = generateId();
        const product: Product = {
            id_Producto: id_Producto,
            nombre_Producto: nombre_Producto,
            fabricante_Producto: fabricante_Producto,
            precio_Producto: precio_Producto
        };

        products.insert(product.id_Producto,product)

        return product;
    }),

    readProducts: query([], Vec(Product), () => {
        return products.values();
    }),
    readProductById: query([text], Opt(Product), (id_Producto) => {
        return products.get(Principal.fromText(id_Producto));
    }),

    deleteProduct: update([text], Result(Product, AplicationError), (id_Producto) => {
        const productOpt = products.get(Principal.fromText(id_Producto));

        if ('None' in productOpt) {
            return Err({
                UserDoesNotExist: id_Producto
            });
        }

        const product = productOpt.Some;
        products.remove(product.id_Producto);
        return Ok(product);
    }),

    updateProduct: update(
        [text, text, text, text],
        Result(Product, AplicationError),
        (productId, nombre_Producto, fabricante_Producto, precio_Producto) => {
            const productOpt = products.get(Principal.fromText(productId));

            if ('None' in productOpt) {
                return Err({
                    productDoesNotExist: productId
                });
            }
            const newProduct: Product = {
                id_Producto:Principal.fromText(productId),
                nombre_Producto: nombre_Producto,
                fabricante_Producto: fabricante_Producto,
                precio_Producto: precio_Producto
            };

            products.remove(Principal.fromText(productId))
            products.insert(Principal.fromText(productId), newProduct);

            return Ok(newProduct);
        }
    )

    
})

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}