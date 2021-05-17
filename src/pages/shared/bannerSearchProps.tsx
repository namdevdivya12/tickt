import React, { useState, useEffect } from 'react';
import Constants from '../../utils/constants';
// @ts-ignore
import PlacesAutocomplete, { geocodeByAddress, getLatLng, } from 'react-places-autocomplete';
import regex from '../../utils/regex';
// @ts-ignore
import { format } from 'date-fns';
// @ts-ignore
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import Searchicon from "../../assets/images/main-search.png";
import search from "../../assets/images/ic-search.png";
import Location from "../../assets/images/ic-location.png";
import cross from "../../assets/images/close-black.png";
import icgps from "../../assets/images/ic-gps.png";
import residential from "../../assets/images/ic-residential.png";
import close from "../../assets/images/icon-close-1.png";

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getSearchJobList, getRecentSearchList, postHomeSearchData } from '../../redux/homeSearch/actions';
import { isHandleChanges } from '../../redux/jobs/actions';
// @ts-ignore
import { useDetectClickOutside } from 'react-detect-click-outside';
import moment from 'moment';
import Geocode from "react-geocode";
import { setShowToast } from '../../redux/common/actions';
import { property } from 'lodash';

Geocode.setApiKey("AIzaSyDKFFrKp0D_5gBsA_oztQUhrrgpKnUpyPo");
Geocode.setLanguage("en");

interface PropsType {
    history: any,
    location?: any,
    bannerData: any,
    selectedItem: any,
    selectedTrade: any,
    current_address: any,
    getTitleInfo: any,
    searchText: any,
    stateData: any,
    addressText: any,
    selectedAddress: any,
    isHandleChanges: (item: any) => void,
    localChanges: boolean,
    searchJobListData: Array<object>,
    recentSearchJobData: Array<object>,
    homeSearchJobData: Array<object>,
    setBannerData: (data: any) => void,
    getSearchJobList: (data: any) => void,
    postHomeSearchData: (data: any) => void,
    handleChangeToggle?: (data: any) => void,
    localInfo: any
}

const example_calender = { startDate: '', endDate: '', key: 'selection1' };

export function useStateFromProp(initialValue: any) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => setValue(initialValue), [initialValue]);

    return [value, setValue];
}

const BannerSearch = (props: PropsType) => {
    let props_selected = props.selectedItem;
    const { selectedItem, isHandleChanges, localChanges, } = props;

    const [stateData, setStateData] = useState<any>(null)
    const [searchText, setSearchText] = useState('');
    const [addressText, setAddressText] = useState<any>(null);
    const [selectedAddress, setSelectedAddress] = useState({});
    const [enableCurrentLocation, setCurrentLocations] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});
    const [selectedTrade, setSelectedTrade] = useState({});

    const [inputFocus1, setInputFocus1] = useState<boolean>(false);
    const [inputFocus2, setInputFocus2] = useState<boolean>(false);
    const [inputFocus3, setInputFocus3] = useState<boolean>(false);

    const [calenderRange1, setCalenderRange1] = useState<any>(example_calender);

    const handleOnOutsideSearch = () => setInputFocus1(false);
    const handleOnOutsideLocation = () => setInputFocus2(false);
    const handleOnOutsideCalender = () => setInputFocus3(false);

    const searchRef = useDetectClickOutside({ onTriggered: handleOnOutsideSearch });
    const locationRef = useDetectClickOutside({
        onTriggered: () => {
            if (addressText?.length > 3) {
                handleOnOutsideLocation()
            }
        }
    });
    const locationRefClone = useDetectClickOutside({
        onTriggered: () => {
            if (!addressText || addressText?.length < 2) {
                handleOnOutsideLocation()
            }
        }
    });
    const calenderRef = useDetectClickOutside({ onTriggered: handleOnOutsideCalender });

    const [sortBy, setSortBy] = useState(1);

    const handleCalenderRange = (item: any) => {
        setCalenderRange1(item.selection1)
    };

    const [checkRender, setRender] = useState(false);

    useEffect(() => {
        let state = props.location.state;
        let local_info: any = props.localInfo;

        if (!searchText?.length && !checkRender) {
            setSearchText(state.name);

            setStateData({
                createdAt: null,
                image: null,
                name: state?.name,
                specializationsId: state?.specializations,
                trade_name: state?.name,
                _id: state?.tradeId
            });

            if (state.calender && Object.keys(state.calender).length) {
                setCalenderRange1(state.calender);
            }

            if (state.location && Object.keys(state.location).length) {
                let coordinates = state.location.coordinates;
                let lat = coordinates[0];
                let lng = coordinates[1];
                setSelectedAddress({ lat, lng });
                setAddressText(state.address);
            }
            setRender(true);
        }

        if (Object.keys(local_info).length) {
            if (searchText?.length !== local_info?.nane) {
                console.log({ local_info })
                if (local_info?.sortBy) {
                    setSortBy(local_info?.sortBy);
                }
                setSearchText(local_info.name);
                setStateData({
                    createdAt: null,
                    image: null,
                    name: local_info?.name,
                    specializationsId: local_info?.specializationId,
                    trade_name: null,
                    _id: local_info?.tradeId
                })
            }
        }

    }, [props])

    useEffect(() => {
        if (addressText?.length > 2) {
            document.getElementById('location-input-tag')?.focus();
        } else {
            document.getElementById('location_search_static')?.focus();
        }
    }, [addressText])

    const checkIfExist = (_id: any) => {
        if (selectedTrade) {
            let isLength = Object.keys(selectedTrade).length;
            if (isLength) {
                let item: any = selectedTrade;
                if (item?._id === _id) {
                    return true;
                }
            }
        }
        return false;
    }

    const recentJobSearches = () => {
        let props_Clone: any = props;
        let tradeListData = props_Clone.tradeListData;
        return (
            <>
                <div className="custom_autosuggestion" id="recent-job-search-div">
                    {props?.recentSearchJobData?.length ?
                        <React.Fragment>
                            <span className="sub_title">Recent searches</span>
                            <div className="flex_row recent_search">
                                {props.recentSearchJobData?.length > 0 && props.recentSearchJobData?.slice(0, 2).map((item: any) => {
                                    return (
                                        <div
                                            className="flex_col_sm_4"
                                            onClick={() => {
                                                setItemSearch({
                                                    createdAt: item?.createdAt,
                                                    image: item.image,
                                                    name: item.name,
                                                    specializationsId: [item.specializationsId],
                                                    trade_name: item.trade_name,
                                                    _id: item._id
                                                });
                                                setSelectedTrade({});
                                            }}>
                                            <div className="autosuggestion_icon card history">
                                                <span>{item.name}</span>
                                                <span className="name">{item.trade_name}</span>
                                            </div>
                                        </div>)
                                })}
                            </div>
                        </React.Fragment>
                        : null}

                    <div className="select_sphere recent_search">
                        <span className="sub_title">Categories</span>
                        <ul>
                            {tradeListData?.map(({ _id, trade_name, selected_url, specialisations }: { _id: string, trade_name: string, selected_url: string, specialisations: [] }) =>
                                <li
                                    onClick={() => {
                                        let item_spec: any = specialisations;
                                        if (item_spec?.length) {
                                            let getItem = item_spec[0];
                                            console.log({ specialisations, getItem })
                                            if (getItem) {
                                                setStateData({
                                                    image: selected_url,
                                                    name: getItem?.name,
                                                    specializationsId: specialisations.map((sp: any) => sp._id),
                                                    trade_name: trade_name,
                                                    _id: _id,
                                                })
                                                setSearchText(getItem?.name);
                                            }
                                            setSelectedTrade({ _id, trade_name, selected_url, specialisations });
                                        }
                                    }}
                                    className={checkIfExist(_id) ? 'active' : ''}>
                                    <figure>
                                        <img src={selected_url} alt="" />
                                    </figure>
                                    <span className="name">{trade_name}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div >
            </>
        )
    }

    const renderJobResult = () => {
        if (props?.searchJobListData?.length) {
            return (
                <div className="custom_autosuggestion" id="fetched-custom-job-category-div">
                    <div className="recent_search">
                        <ul className="drop_data">
                            {props.searchJobListData?.map((item: any) => {
                                return (
                                    <li onClick={() => {
                                        setItemSearch(item);
                                    }}>
                                        <figure className="category">
                                            <img src={item.image ? item.image : residential} alt="icon" />
                                        </figure>
                                        <div className="details">
                                            <span className="name">{item.name}</span>
                                            <span className="prof">{item.trade_name}</span>
                                        </div>
                                    </li>)
                            })}
                        </ul>
                    </div>
                </div>
            )
        }
        return null;
    }

    const onError = (status: string, clearSuggestions: Function) => {
        console.log('Google Maps API returned error with status: ', status)
        clearSuggestions();
    }

    const validateForm = () => {
        return true;
    }

    const setItemSearch = (item: any) => {
        setStateData(item);
        setSelectedTrade({});
        setSearchText(item?.name || '');
    }

    const bannerSearchClicked = () => {
        let selected_address: any = selectedAddress;
        let selected_trade: any = selectedTrade;
        let selected_item: any = props?.selectedItem;
        let props_trade: any = selected_item?.selectedTrade;

        if (!stateData?._id && !props_trade?._id) {
            setShowToast(true, 'please enter the valid search text.');
            return;
        }

        if (validateForm()) {
            let data: any = {
                page: 1,
                sortBy: sortBy,
                isFiltered: true,
                tradeId: Array.isArray(stateData?._id) ? stateData?._id : [stateData?._id],
                specializationId: Array.isArray(stateData?.specializationsId) ? stateData?.specializationsId : [stateData?.specializationsId],
            }

            if (Object.keys(selectedAddress).length) {
                data['location'] = {
                    "coordinates": [
                        selected_address?.lng,
                        selected_address?.lat
                    ]
                }
            } else {
                delete data.location;
            }

            if (moment(calenderRange1?.startDate).isValid()) {
                data['from_date'] = moment(calenderRange1?.startDate).format('YYYY-MM-DD')
            } else {
                delete data.from_date;
            }

            if (moment(calenderRange1?.endDate).isValid()) {
                data['to_date'] = moment(calenderRange1?.endDate).format('YYYY-MM-DD')
            } else {
                delete data.to_date;
            }


            if (props_trade?._id) {
                data['tradeId'] = [props_trade._id];
                if (props_trade?.specialisations?.length) {
                    data['specializationId'] = props_trade.specialisations.map((item: any) => {
                        if (item?._id) {
                            return item?._id;
                        }
                        return item;
                    });
                }
            } else {
                if (selected_trade) {
                    if (Object.keys(selected_trade).length) {
                        data['tradeId'] = [selected_trade._id];
                        if (selected_trade?.specialisations?.length) {
                            data['specializationId'] = selected_trade.specialisations.map((item: any) => item._id);
                        }
                    }
                }
            }

            if (sortBy === 2) {
                if (Object.keys(selected_address)?.length) {
                    data['location'] = {
                        "coordinates": [
                            selected_address?.lng,
                            selected_address?.lat
                        ]
                    }
                }
            }

            console.log({ data }, '----------------------->')
            props.getTitleInfo({
                name: searchText,
                count: data?.specializationId?.length,
                tradeId: data.tradeId,
                specializationId: data.specializationId,
                location: data.location,
                from_date: data?.from_date,
                to_date: data?.to_date
            })
            props.postHomeSearchData(data);

            // isHandleChanges(false)
            // props.history.push({
            //     pathname: `search-tradie-results`,
            //     state: {
            //         data,
            //         stateData,
            //         searchText,
            //         selectedAddress,
            //         addressText,
            //         selectedTrade,
            //         calenderRange1,
            //         exta: (selected_trade.specialisations?.length - 1)
            //     }
            // })
        }
    }

    const getCurrentLocation = async () => {
        let local_position: any = localStorage.getItem('position');
        let position: any = JSON.parse(local_position);
        if (position?.length) {
            let long = (position[0]).toString();
            let lat = (position[1]).toString();
            let response: any = await Geocode.fromLatLng(lat, long);
            if (response?.results && Array.isArray(response.results) && response?.results?.length) {
                const address = response.results[0].formatted_address;
                setSelectedAddress({ lat, long });
                setAddressText(address);
                setInputFocus2(true);
                setCurrentLocations(true);
                // this.setState({ currentAddressLatLng: { long, lat }, addressText: address, enableCurrentLocation: true, inputFocus2: true })
            }
        }
    }

    let state_data: any = stateData;

    let length_spec = 0;

    if (state_data?.specializationsId?.length) {
        length_spec = state_data?.specializationsId?.length;
    }
    console.log({ state_data, length_spec })
    let custom_name = searchText;
    let condition_location: any = addressText?.length > 2 || (addressText?.length && enableCurrentLocation && Object.keys(selectedAddress).length);
    return (
        <div className="home_search">
            <button
                onClick={() => {
                    if (props?.handleChangeToggle) {
                        props.handleChangeToggle(false)
                    }
                }}
                className="modal_srch_close">
                <img src={close} alt="close" />
            </button>
            <form className="search_wrapr">
                <ul>
                    <li className="categ_box">
                        <div className="text_field" id="text-field-div">
                            <input
                                type="text"
                                ref={searchRef}
                                placeholder="What jobs are you after?"
                                value={length_spec > 1 ? `${custom_name} +${length_spec - 1}` : (custom_name)}
                                onChange={(e) => {
                                    isHandleChanges(true)
                                    setSearchText(e.target.value);
                                    setStateData({});
                                    props.getSearchJobList(e.target.value)
                                }}
                                // readOnly={props?.selectedItem ? true : false}
                                onFocus={() => { setInputFocus1(true) }}
                            />
                            <div className="border_eff"></div>
                            <span className="detect_icon_ltr">
                                <img src={Searchicon} alt="search" />
                            </span>
                            {searchText?.length && inputFocus1 ? (
                                <span className="detect_icon" >
                                    <img
                                        src={cross}
                                        alt="cross"
                                        onClick={() => {
                                            // clear here
                                            setStateData({});
                                            isHandleChanges(true)
                                            setSearchText('');
                                        }} />
                                </span>
                            ) : null}
                        </div>
                        {!!errors.searchedJob && <span className="error_msg">{errors.searchedJob}</span>}
                    </li>
                    {!searchText?.length && inputFocus1 ? recentJobSearches() : null}
                    {searchText?.length && inputFocus1 ? renderJobResult() : null}

                    {/* {'location search start here!'} */}
                    <li className="loc_box">
                        <div id="location-text-field-div">

                            <div
                                className={`text_field ${addressText?.length > 2 ? 'none' : ''}`}>
                                <input
                                    id="location_search_static"
                                    placeholder='Where?'
                                    ref={locationRefClone}
                                    value={addressText}
                                    autoComplete="nope"
                                    className={'line-1'}
                                    onChange={(e: any) => { setAddressText(e.target.value) }}
                                    onFocus={() => {
                                        setInputFocus2(true)
                                        console.log('Hard --->', { addressText, inputFocus2 })
                                    }}
                                />
                                <span className="detect_icon_ltr">
                                    <img src={Location} alt="location" />
                                </span>
                            </div>


                            <div>
                                <PlacesAutocomplete
                                    value={addressText}
                                    onChange={(item: any) => {
                                        setAddressText(item)
                                        if (!addressText.length) {
                                            setSelectedAddress({});
                                        }
                                    }}
                                    shouldFetchSuggestions={true}
                                    onSelect={async (address) => {
                                        let selected_address: any = address;
                                        if (address.indexOf(',')) {
                                            selected_address = address.split(',')[0];
                                        }
                                        setAddressText(selected_address);
                                        let response = await Geocode.fromAddress(address);
                                        if (response?.results?.length) {
                                            const { lat, lng } = response.results[0].geometry.location;
                                            setSelectedAddress({ lat, lng });
                                            setInputFocus2(false);
                                        }
                                    }}
                                    highlightFirstSuggestion={true}
                                    onError={onError}
                                    debounce={0}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }: any) => (
                                        <div>
                                            <div
                                                className={`text_field ${addressText?.length > 2 ? '' : 'none'}`}>
                                                <input
                                                    {...getInputProps({ placeholder: 'Where?', className: 'line-1' })}
                                                    id="location-input-tag"
                                                    ref={locationRef}
                                                    onFocus={() => {
                                                        setInputFocus2(true)
                                                    }}
                                                />
                                                <span className="detect_icon_ltr">
                                                    <img src={Location} alt="location" />
                                                </span>
                                                {inputFocus2 && addressText?.length > 2 ?
                                                    <span className="detect_icon" >
                                                        <img
                                                            src={cross}
                                                            alt="cross"
                                                            onClick={() => {
                                                                setAddressText('');
                                                                setSelectedAddress({});
                                                            }}
                                                        />
                                                    </span> : null}
                                            </div>
                                            {suggestions?.length && inputFocus2 ?
                                                <div className="custom_autosuggestion location" id="autocomplete-dropdown-container">
                                                    <div className="flex_row recent_search auto_loc">
                                                        <div className="flex_col_sm_4">
                                                            {!!errors.selectedMapLocation && <span className="error_msg">{errors.selectedMapLocation}</span>}
                                                            {loading && <div>Loading...</div>}
                                                            {suggestions.map((suggestion: any) => {
                                                                const className = 'autosuggestion_icon card loc name';
                                                                const style = suggestion.active
                                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                return (
                                                                    <div
                                                                        {...getSuggestionItemProps(suggestion, { className, style, })}>
                                                                        <span>{suggestion.formattedSuggestion.mainText}</span>
                                                                        <span className="name">{suggestion.formattedSuggestion.secondaryText}</span>

                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div> : !loading && addressText?.length > 2 && !suggestions?.length && !enableCurrentLocation && !Object.keys(selectedAddress).length ? (
                                            <div style={{ minHeight: '50px' }} className="custom_autosuggestion location" id="autocomplete-dropdown-container">
                                                <div className="flex_row recent_search auto_loc">
                                                    <div className="flex_col_sm_4">
                                                        <div className="loc_suggestions">
                                                            {'No Result Found.'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                                ) : null}
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </div>
                        </div>
                        {!!errors.selectedMapLocation && <span className="error_msg">{errors.selectedMapLocation}</span>}
                    </li>

                    {/* {'location search end here!'} */}
                    {!addressText?.length && inputFocus2 ?
                        <div className="custom_autosuggestion location" id="current-location-search-div">
                            <span
                                className="location-btn"
                                onClick={getCurrentLocation}>
                                <span className="gps_icon">
                                    <img src={icgps} alt="" />
                                </span> Use my current location
                            </span>
                            {stateData?.locationDenied && <span className="blocked_note">
                                You have blocked your location.
                                To use this, change your location settings in browser.
                              </span>}
                        </div>
                        : null}
                    <li>
                        <div
                            ref={calenderRef}
                            className="custom_date_range" id="date-range-div">
                            <div className="text_field">
                                <span className="detect_icon_ltr calendar"></span>
                                <input
                                    type="text"
                                    placeholder={calenderRange1?.startDate && !calenderRange1.endDate ?
                                        `${moment(calenderRange1?.startDate).format('MMM-DD')}` :
                                        calenderRange1?.startDate && calenderRange1.endDate ?
                                            `${moment(calenderRange1?.startDate).format('DD MMM')}-${moment(calenderRange1?.endDate).format('DD MMM')}`
                                            : "When?"}
                                    onFocus={() => setInputFocus3(true)}
                                />
                                {calenderRange1?.startDate && inputFocus3 &&
                                    <span className="detect_icon" >
                                        <img
                                            src={cross}
                                            alt="cross"
                                            onClick={() => {
                                                setCalenderRange1({ startDate: '', endDate: '', key: 'selection1' })
                                            }} />
                                    </span>}
                            </div>
                            {/* {inputFocus3 && */}
                            {inputFocus3 ? (
                                <div
                                    className="custom_autosuggestion"
                                    id="custom-date-range-div">
                                    <DateRange
                                        onChange={handleCalenderRange}
                                        ranges={[calenderRange1]}
                                        moveRangeOnFirstSelection={false}
                                        rangeColors={["#fee600", "#b5b5b5"]}
                                        showDateDisplay={false}
                                        showSelectionPreview={true}
                                        months={2}
                                        showPreview={true}
                                        minDate={new Date()}
                                        maxDate={moment().add(2, 'years').toDate()}
                                        direction="horizontal"
                                        fixedHeight={true}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </li>
                    <div className="search_btn">
                        <button type="button" className="fill_btn" onClick={bannerSearchClicked}>
                            <img src={search} alt="search" />
                        </button>
                    </div>
                </ul>
            </form>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        searchJobListData: state.homeSearch.searchJobListData,
        recentSearchJobData: state.homeSearch.recentSearchJobData,
        homeSearchJobData: state.homeSearch.homeSearchJobData,
        tradeListData: state.auth.tradeListData,
        localChanges: state.jobs.localChanges
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getSearchJobList,
        getRecentSearchList,
        postHomeSearchData,
        isHandleChanges
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerSearch);