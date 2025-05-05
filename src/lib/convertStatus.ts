
type StatusMapType = {
    AVAILABLE: string;
    NOT_AVAILABLE: string;
}

export const convertStatusMenu = (status) => {
    switch(status) {
        case 'active':
            return 'Actif';
        case 'inactive':
            return 'Inactif';
        case 'discontinued':
            return 'Discontinué';
        default:
            return 'Statut inconnu';
    }
};


export const convertStatusToTable = (status: string) => {
    const statusMap = {
        'AVAILABLE': 'Disponible',
        'NOT_AVAILABLE': 'Non disponible'
    };

    const formattedStatus = statusMap[status.toUpperCase()] || 'Statut inconnu';

    return formattedStatus.toLowerCase();
};


export const convertStatusToRoom = (status: string) => {
    const statusMap = {
        'AVAILABLE': 'Disponible',
        'NOT_AVAILABLE': 'Non disponible'
    };

    const formattedStatus = statusMap[status.toUpperCase()] || 'Statut inconnu';

    return formattedStatus.toLowerCase();
};


export const convertStatusToOrder = (status) => {
    const statusMap = {
        NOT_DELIVERED: 'non livré',
        DELIVERED: 'livré',
    };

    return statusMap[status.toUpperCase()] || status;
};


    export const convertStatusToReservation = (status) => {
        const statusMap = {
            PENDING: 'En attente',
            CONFIRMED: 'Confirmé',
            CANCELED: 'Annulé',
        };
    
        return statusMap[status.toUpperCase()] || status;
    };
   
    export const convertStatusToPayment = (status) => {
        const statusMap = {
            PAID: 'Payé',
            UNPAID: 'Non payé',
        };
    
        return statusMap[status.toUpperCase()] || status;
    };


export const convertDepositWithdraw = (type) => {
    const types = new Map([
        ['manual_deposit', 'Dépôt manuel'],
        ['manual_withdrawal', 'Retrait manuel'],
        ['ingredient_purchase', 'Achat d\'ingrédient'],
        ['menu_sale_deposit', 'Dépôt de vente du menu']
    ]);

    return types.get(type.toLowerCase()) || 'Type de transaction inconnu';
};
