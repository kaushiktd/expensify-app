import type * as OnyxCommon from './OnyxCommon';
import type PersonalDetails from './PersonalDetails';

// TODO: specify correct type when API is updated
/** Model of an Expensify card */
type ExpensifyCard = OnyxCommon.OnyxValueWithOfflineFeedback<{
    /** Cardholder personal details */
    cardholder: PersonalDetails;

    /** Card related error messages */
    errors?: OnyxCommon.Errors;

    /** The last four digits of the card */
    lastFourPAN: string;

    /** Card name */
    name: string;

    /** Card limit */
    limit: string;
}>;

/** List of Expensify cards */
type ExpensifyCardsList = Record<string, ExpensifyCard>;

export default ExpensifyCard;
export type {ExpensifyCardsList};
