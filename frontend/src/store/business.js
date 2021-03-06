import {csrfFetch} from './csrf';
import {LOAD_REVIEWS,REMOVE_REVIEW,ADD_REVIEW} from "./reviews";

const SET_BUSINESS = 'business/setBusiness';
const REMOVE_BUSINESS = 'business/removeBusiness';
const LOAD = "business/load";

const setBusiness = (business)=>{
    return {
        type: SET_BUSINESS,
        payload: business,
    };
};

const removeBusiness = (businessId)=>{
    return {
        type: REMOVE_BUSINESS,
    };
};

const load = (list) => ({
    type:LOAD,
    list,
});

const initialState = {list: []};

const sortList = (list) => {
    return list
      .sort((businessA, businessB) => {
        return businessA.zip_code - businessB.zip_code;
      })
      .map((business) => business.id);
  };
  
export const editDBBusiness = (business, flag=1) => async (dispatch) => {
    const {name,description,image,address,city,state,zip_code,lat,lng,userId} = business;
    let method = "POST";
    let url='/api/business';
    if(flag === 1){
        method = "PATCH";
        url = `/api/business/${business.id}`;
    }
    const response = await csrfFetch(url,{
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name,
            description,
            image,
            address,
            city,
            state,
            zip_code,
            //lat,
            //lng,
            userId
        }),
    });
    if(response.ok){
        const data = await response.json();
        dispatch(setBusiness(data.business));
        return response;
    }
    else{
        const error = await response.json();
        console.error("ERROR : ", error);
        return error;
    }
}

export const delDBBusiness = (business) => async dispatch => {
    const res = await csrfFetch(`/api/business/${business.id}`, {
        method: "DELETE",
    });
    if(res.ok) {
        const result = await res.json();
        dispatch(removeBusiness(business.id));
    }
    else{
        const err = await res.json();
        console.log(err);
    }
};

export const getOneBusiness = (id) => async (dispatch) => {
    const response = await fetch(`/api/business/${id}`);
    if(response.ok) {
        const {business} = await response.json();
        dispatch(setBusiness(business));
    }
}
export const getBusiness = () => async (dispatch) => {
    const response = await fetch(`/api/business`);
  
    if (response.ok) {
      const list = await response.json();
      dispatch(load(list));
    }
  };

const businessReducer = (state=initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_BUSINESS:
            if(!state[action.payload.id]){
                //newState = Object.assign({},state);
                newState = {
                    ...state,
                    [action.payload.id]: action.payload
                };
                const businessList = newState.list.map((id)=>newState[id]);
                businessList.push(action.payload);
                newState.list = businessList;
                return newState;
            }
            else{
                return {
                    ...state,
                    [action.payload.id] : {
                        ...state[action.payload.id],
                        ...action.payload,
                    },
                };
            }
        case REMOVE_BUSINESS:
            newState = Object.assign({},state);
            newState.business = null;
            return newState;
        case LOAD:
            const allBusiness = {};
            action.list.businesses.forEach((business)=>{
                allBusiness[business.id] = business;
            });
            return {...allBusiness,...state,list: action.list.businesses};
        case LOAD_REVIEWS:
            return {
                ...state,
                [action.businessId]: {
                    ...state[action.businessId],
                    reviews: action.reviews.map((review)=>{
                        return review.id
                    }),
                },
            };
        // case REMOVE_REVIEW:
        //     return {
        //         ...state,
        //         [action.businessId]: {
        //             reviews: state[action.businessId].reviews.filter(
        //                 (reviewId) => reviewId !== action.reviewId
        //             ),
        //         }
        //     }
        case ADD_REVIEW:
            return {
                ...state,
                [action.review.businessId]: {
                    ...state[action.review.businessId],
                    reviews: [...state[action.review.businessId].reviews,action.review.id],
                },
            };

        default:
            return state;
    }
}

export default businessReducer;