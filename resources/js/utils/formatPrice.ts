export const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};
