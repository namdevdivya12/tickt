import { useState, useEffect } from 'react';
import Constants from '../../../../../utils/constants';
// @ts-ignore
import PlacesAutocomplete, { geocodeByAddress, getLatLng, } from 'react-places-autocomplete';
import regex from '../../../../../utils/regex';
// @ts-ignore
import { subDays, isEqual, isBefore, differenceInHours, lightFormat, format } from 'date-fns';
// @ts-ignore
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import Searchicon from "../../../../../assets/images/main-search.png";
import search from "../../../../../assets/images/ic-search.png";
import Location from "../../../../../assets/images/ic-location.png";
import cross from "../../../../../assets/images/close-black.png";
import icgps from "../../../../../assets/images/ic-gps.png";
import residential from "../../../../../assets/images/ic-residential.png";
import close from "../../../../../assets/images/icon-close-1.png";


const BannerSearch = (props: any) => {
    const [stateData, setStateData] = useState<any>({
        page: 1,
        searchedJob: '',
        isSearchedJobSelected: false,
        tradeId: '',
        specializationId: '',
        searchedJobId: null,
        location: {
            coordinates: []
        },
        locationName: '',
        selectedMapLocation: '',
        isMapLocationSelected: false,
        from_date: '',
        startDate: '',
        to_date: '',
        endDate: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [inputFocus1, setInputFocus1] = useState<boolean>(false)
    const [inputFocus2, setInputFocus2] = useState<boolean>(false)
    const [inputFocus3, setInputFocus3] = useState<boolean>(false)

    const [calenderRange1, setCalenderRange1] = useState<any>({ startDate: new Date(), endDate: new Date(), key: 'selection1' });


    useEffect(() => {
        console.log(props, "bannerSearch props")
        if (props.location?.state?.selectedMapLocation) {
            setStateData((prevData: any) => ({ ...prevData, selectedMapLocation: props.location?.state?.selectedMapLocation }))
        }
        window.addEventListener('mousedown', handleClicked)

        return () => {
            window.removeEventListener('mousedown', handleClicked)
        }
    }, [])

    useEffect(() => {
        if (calenderRange1 && inputFocus3) {
            const startDate = format(new Date(calenderRange1.startDate), 'MMM dd')
            const endDate = format(new Date(calenderRange1.endDate), 'MMM dd')
            const start_date = format(new Date(calenderRange1.startDate), 'yyyy-MM-dd')
            const end_date = format(new Date(calenderRange1.endDate), 'yyyy-MM-dd')
            setStateData((prevData: any) => ({ ...prevData, startDate: startDate, endDate: endDate }))
            setStateData((prevData: any) => ({ ...prevData, start_date: start_date, end_date: end_date }))
        }
    }, [calenderRange1])

    const handleClicked = (event: any) => {
        if ((document.getElementById("recent-job-search-div") || document.getElementById("fetched-custom-job-category-div")) && (!document.getElementById("text-field-div")?.contains(event.target) && !document.getElementById("recent-job-search-div")?.contains(event.target)) && (!document.getElementById("fetched-custom-job-category-div")?.contains(event.target))) {
            setInputFocus1(false)
        }

        if ((document.getElementById("current-location-search-div") || document.getElementById("autocomplete-dropdown-container")) && !document.getElementById("location-text-field-div")?.contains(event.target) && !document.getElementById("current-location-search-div")?.contains(event.target)) {
            setInputFocus2(false)
        }

        if (document.getElementById("custom-date-range-div") && (!document.getElementById("date-range-div")?.contains(event.target) && !document.getElementById("custom-date-range-div")?.contains(event.target))) {
            setInputFocus3(false)
        }
    }

    const handleCalenderRange = (item: any) => {
        // if (!isEqual(item.selection1?.startDate, item.selection1?.endDate) && isBefore(item.selection1?.startDate, item.selection1?.endDate)) {
        //     var hours = differenceInHours(new Date(item.selection1?.endDate), new Date(item.selection1?.startDate));
        //     if (hours >= 25) {
        //         setCalenderRange2((prevData: any) => ({ ...prevData, startDate: addDays(item.selection1?.startDate, 1), endDate: subDays(item.selection1?.endDate, 1) }))
        //     }
        // } else {
        //     setCalenderRange2((prevData: any) => ({ ...prevData, startDate: null, endDate: null }))
        // }
        setCalenderRange1(item.selection1)
    };

    console.log(stateData, "stateData")

    const checkInputValidation = (e: any) => {
        const alphaRegex = new RegExp(regex.alphaSpecial)
        return alphaRegex.test(e.target.value)
    }

    const handleJobChange = (e: any) => {
        if (checkInputValidation(e)) {
            e.target.value.length >= 1 && props.getSearchJobList(e.target.value)
            setStateData((prevData: any) => ({ ...prevData, searchedJob: e.target.value, isSearchedJobSelected: false }))
        }
    }

    const cleanInputData = (item: string) => {
        if (item === "calender") {
            setStateData((prevData: any) => ({ ...prevData, start_date: '', end_date: '', startDate: '', endDate: '' }))
            return;
        }
        setStateData((prevData: any) => ({ ...prevData, [item]: '' }))
    }

    const searchedJobClicked = (item: any) => {
        setStateData((prevData: any) => ({ ...prevData, searchedJob: item.name, tradeId: item._id, specializationId: item.specializationsId, isSearchedJobSelected: true }));
        setInputFocus1(false);
    }

    const recentJobSearches = () => {
        return (
            <div className="custom_autosuggestion" id="recent-job-search-div">
                <span className="sub_title">Recent searches</span>
                <div className="flex_row recent_search">
                    <div className="flex_col_sm_4" onClick={() => searchedJobClicked({ name: 'Campervans', _id: 'dhc78hi237hiu', specializationId: 'jey89ehe997yyh' })}>
                        <div className="autosuggestion_icon card history">
                            <span>Campervans</span>
                            <span className="name">Vehicles</span>
                        </div>
                    </div>

                    <div className="flex_col_sm_4">
                        <div className="autosuggestion_icon card history">
                            <span>sparknotes1</span>
                            <span className="name">sparknotes</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderJobResult = () => {
        return (
            props.searchJobListData?.length ? <div className="custom_autosuggestion" id="fetched-custom-job-category-div">
                <div className="recent_search">
                    <ul className="drop_data">
                        {props.searchJobListData?.map((item: any) => {
                            return (<li onClick={() => searchedJobClicked(item)}>
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
            </div> : <span className="error_msg">Please select job type from the list</span>
        )
    }

    const locationSelectedHandler = (address: string) => {
        console.log("locationSelectedHandler", address, typeof address)
        setStateData((prevData: any) => ({ ...prevData, selectedMapLocation: address, isMapLocationSelected: true }))
        setInputFocus2(false);
        document.getElementById("location-input-tag")?.blur();
        geocodeByAddress(address)
            .then((results: any) => getLatLng(results[0]))
            .then((latLng: any) => console.log('Success', latLng))
            .catch((error: any) => console.error('Error', error));
    }

    const getCurrentLocation = (e: any) => {
        e.preventDefault();
        console.log("use my current location clicked")
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            setInputFocus2(false);
        });

        // geocodeByAddress(address)
        //     .then((results: any) => getLatLng(results[0]))
        //     .then((latLng: any) => console.log('Success', latLng))
        //     .catch((error: any) => console.error('Error', error));
    }

    const onError = (status: string, clearSuggestions: Function) => {
        console.log('Google Maps API returned error with status: ', status)
        clearSuggestions();
    }

    const validateForm = () => {
        const newErrors: any = {};
        if (!stateData.isSearchedJobSelected) {
            newErrors.searchedJob = Constants.errorStrings.bannerSearchJob;
        } else if (!stateData.searchedJob) {
            newErrors.searchedJob = Constants.errorStrings.bannerSearchJobEmpty;
        } else {
            const searchJobRegex = new RegExp(regex.alphaSpecial);
            if (!searchJobRegex.test(stateData.searchedJob.trim())) {
                newErrors.searchedJob = Constants.errorStrings.bannerSearchJob;
            }
        }

        if (!stateData.isMapLocationSelected && stateData.selectedMapLocation) {
            newErrors.selectedMapLocation = Constants.errorStrings.bannerSearchLocation;
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const bannerSearchClicked = () => {
        if (validateForm()) {
            const data = {
                page: stateData.page,
                tradeId: stateData.tradeId,
                // location: stateData.location,
                specializationId: stateData.specializationId,
                // from_date: stateData.from_date,
                // to_date: stateData.to_date,
                // sortBy: 2,
            }
            props.postHomeSearchData(data)
            // alert("banner search clicked!")
        }
    }

    console.log(props.homeSearchJobData, " props homeSearchJobData");

    return (
        <div className="home_search">
            <button className="modal_srch_close">
                <img src={close} alt="close" />
            </button>
            <form className="search_wrapr">
                <ul>
                    <li className="categ_box">
                        <div className="text_field" id="text-field-div">
                            <input type="text" placeholder="What jobs are you after?" value={stateData.searchedJob} onChange={handleJobChange} onFocus={() => setInputFocus1(true)} />
                            <div className="border_eff"></div>
                            <span className="detect_icon_ltr">
                                <img src={Searchicon} alt="search" />
                            </span>
                            {stateData.searchedJob && inputFocus1 &&
                                <span className="detect_icon" >
                                    <img src={cross} alt="cross" onClick={() => cleanInputData('searchedJob')} />
                                </span>}
                        </div>
                        {!!errors.searchedJob && <span className="error_msg">{errors.searchedJob}</span>}
                    </li>
                    {!stateData.searchedJob && inputFocus1 && recentJobSearches()}
                    {stateData.searchedJob.length >= 1 && inputFocus1 && renderJobResult()}
                    <li className="loc_box">
                        <div id="location-text-field-div">
                            <PlacesAutocomplete
                                value={stateData.selectedMapLocation}
                                onChange={(city: string) => setStateData((prevData: any) => ({ ...prevData, selectedMapLocation: city, isMapLocationSelected: false }))}
                                shouldFetchSuggestions={true}
                                onSelect={locationSelectedHandler}
                                highlightFirstSuggestion={true}
                                // searchOptions={{ types: ['(cities)'] }}
                                onError={onError}
                                debounce={400}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }: any) => (
                                    <div>
                                        <div className="text_field">
                                            <input {...getInputProps({ placeholder: 'Where?', className: 'line-1' })} id="location-input-tag" onFocus={() => setInputFocus2(true)} />
                                            <span className="detect_icon_ltr">
                                                <img src={Location} alt="location" />
                                            </span>
                                            {stateData.selectedMapLocation && inputFocus2 && <span className="detect_icon" >
                                                <img src={cross} alt="cross" onClick={() => setStateData((prevData: any) => ({ ...prevData, selectedMapLocation: '' }))} />
                                            </span>}
                                        </div>
                                        {suggestions.length > 0 && stateData.selectedMapLocation && inputFocus2 && <div className="custom_autosuggestion location" id="autocomplete-dropdown-container">
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
                                                                {...getSuggestionItemProps(suggestion, {
                                                                    className,
                                                                    style,
                                                                })}
                                                            >
                                                                {/* <span>{suggestion.description}</span> */}
                                                                <span>{suggestion.formattedSuggestion.mainText}</span>
                                                                <span className="name">{suggestion.formattedSuggestion.secondaryText}</span>
                                                                {/* {console.log(suggestion, "map suggestion")} */}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                )}
                            </PlacesAutocomplete>
                        </div>
                        {!!errors.selectedMapLocation && <span className="error_msg">{errors.selectedMapLocation}</span>}
                    </li>
                    {!stateData.selectedMapLocation && inputFocus2 &&
                        <div className="custom_autosuggestion location" id="current-location-search-div">
                            <a className="location-btn" onClick={getCurrentLocation}>
                                <span className="gps_icon">
                                    <img src={icgps} />
                                </span> Use my current location
                            </a>
                        </div>
                    }
                    <li>
                        <div className="custom_date_range" id="date-range-div">
                            <div className="text_field">
                                <span className="detect_icon_ltr calendar"></span>
                                <input type="text" placeholder={stateData.startDate ? `${stateData.startDate} - ${stateData.endDate}` : "When?"} onFocus={() => setInputFocus3(true)} />
                                {stateData.startDate && inputFocus3 &&
                                    <span className="detect_icon" >
                                        <img src={cross} alt="cross" onClick={() => cleanInputData('calender')} />
                                    </span>}
                            </div>
                            {inputFocus3 &&
                                <div className="custom_autosuggestion" id="custom-date-range-div">
                                    <DateRange
                                        // ranges={calenderRange2.endDate ? [calenderRange1, calenderRange2] : [calenderRange1]}
                                        // initialFocusedRange={[0,2]}
                                        // color="red"
                                        onChange={handleCalenderRange}
                                        ranges={[calenderRange1]}
                                        moveRangeOnFirstSelection={false}
                                        rangeColors={["#fee600", "#b5b5b5"]}
                                        showDateDisplay={false}
                                        showSelectionPreview={true}
                                        months={2}
                                        showPreview={true}
                                        minDate={new Date()}
                                        direction="horizontal"
                                        fixedHeight={true}
                                    />
                                </div>}
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

export default BannerSearch;
