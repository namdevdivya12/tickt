import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const categoriesjob = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
    }
};

const JobTypeList = (props: any) => {
    useEffect(() => {
        props.getJobTypeList();
    }, [])

    const jobTypeListClicked = (tradeId: string, jobTypeHeadingName: string) => {
        props.history.push({
            pathname: '/search-job-results',
            state: {
                queryParam: "jobTypeList",
                bannerData: props.bannerData,
                heading: jobTypeHeadingName,
                tradeId: [tradeId],
            }
        })
    }

    console.log(props.jobTypeListData, "jobTypeListData  type==>", props.jobTypeData);

    return (
        <div className="home_job_categories">
            <div className="custom_container">
                <Carousel className="item_slider" responsive={categoriesjob} autoPlay={true} arrows={false} showDots={true} infinite={false}>
                    <div>
                        <ul className="job_categories">
                            {props.jobTypeListData?.length ? props.jobTypeListData?.map((item: any) => {
                                return (
                                    < li className="draw" onClick={() => jobTypeListClicked(item._id, item.name)}>
                                        <figure className="type_icon">
                                            <img src={item.image} alt="icon" />
                                        </figure>
                                        <span className="name">{item.name}</span>
                                    </li>
                                )
                            }) : <span>Loading...</span>}
                        </ul>
                    </div>
                </Carousel>
            </div>
        </div >
    )
}

export default JobTypeList
