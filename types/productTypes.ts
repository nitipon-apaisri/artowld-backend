interface productType {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: Buffer | string;
    tags: string[];
    owner: string;
    licenseType: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export { productType };
