export default class KoalaError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, KoalaError.prototype);
    }
}
