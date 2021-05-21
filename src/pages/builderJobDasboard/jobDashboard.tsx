/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom';
import menu from '../../assets/images/menu-line-blue.png';
import close from '../../assets/images/ic-cancel-blue.png';
import media from '../../assets/images/portfolio-placeholder.jpg';
import approved from '../../assets/images/approved.png';
import tradieListData from '../shared/tradieListData';
import rateStar from '../../assets/images/ic-star-fill.png';
import moment from 'moment';

import ActiveJobsComponent from './components/activeJobs';
import OpenJobsComponent from './components/openJobs';
import PastJobsComponent from './components/pastJobs';
import NewApplicantComponent from './components/newApplicants';

interface Props {
    getActiveJobsBuilder: (page: number) => void,
    getPastJobsBuilder: (page: number) => void,
    getNewApplicantsBuilder: (page: number) => void,
    getOpenJobsBuilder: (page: number) => void,
    getnewJobApplicationListBuilder: (page: number, jobId: any) => void,
    activeJobs: any,
    pastJobs: any,
    openJobs: any
    applicantJobs: any,
    approvalJobs: any,
    applicantsListJobs: any
}

const JobDashboard = ({
    getActiveJobsBuilder,
    getPastJobsBuilder,
    getnewJobApplicationListBuilder,
    getOpenJobsBuilder,
    getNewApplicantsBuilder,
    activeJobs,
    openJobs,
    pastJobs,
    applicantJobs,
    approvalJobs,
    applicantsListJobs
}: Props) => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [jobType, setJobtype] = useState('active');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobId, setJobId] = useState(null);
    const [dataItems, setDataItems] = useState({ activeJobs: {}, openJobs: {}, pastJobs: {}, applicantJobs: {}, approvalJobs: {} });

    useEffect(() => {
        setDataItems((prev) => ({ ...prev, activeJobs, openJobs, pastJobs, applicantJobs, approvalJobs, applicantsListJobs }));
    }, [activeJobs, openJobs, pastJobs, applicantJobs, approvalJobs, applicantsListJobs])

    const fetchActive = (page: any) => {
        if (jobType === 'active') {
            if (getActiveJobsBuilder) {
                getActiveJobsBuilder(page);
            }
        }

        if (jobType === 'past') {
            if (getPastJobsBuilder) {
                getPastJobsBuilder(page);
            }
        }

        if (jobType === 'open') {
            if (getOpenJobsBuilder) {
                getOpenJobsBuilder(page);
            }
        }

        if (jobType === 'applicant') {
            if (getNewApplicantsBuilder) {
                getNewApplicantsBuilder(page);
            }
        }

        if (jobType === 'applicantList') {
            if (getnewJobApplicationListBuilder) {
                console.log({ page, jobId });
                getnewJobApplicationListBuilder(page, jobId);
            }
        }

        if (jobType === 'approval') {
            // approval
        }
    }

    useEffect(() => {
        fetchActive(currentPage);
    }, [])

    useEffect(() => {
        fetchActive(currentPage);
    }, [jobType]);


    const setJobLabel = (item: any) => {
        setJobId(item.jobId);
        setJobtype(item.title);
    }


    let data_item: any = dataItems;
    let currentItem = data_item[`${jobType}Jobs`]
    let needApprovalCount: any = 0;
    let newApplicantsCount: any = 0;
    if (currentItem && Object.keys(currentItem)?.length) {
        needApprovalCount = currentItem.needApprovalCount;
        newApplicantsCount = currentItem.newApplicantsCount;
    }
    return (
        <div className="app_wrapper">
            <div className="custom_container">
                <span
                    className="mob_side_nav"
                    onClick={() => setOpenSidebar(!openSidebar)}
                >
                    <img src={menu} alt="mob-side-nav" />
                </span>
                <div className="f_row">
                    <div className={`side_nav_col${openSidebar ? ' active' : ''}`}>
                        <button className="close_nav" onClick={() => setOpenSidebar(false)}>
                            <img src={close} alt="close" />
                        </button>
                        <div className="stick">
                            <span className="title">Job Dashboard</span>
                            <ul className="dashboard_menu">
                                <li>
                                    <span className={`icon star ${jobType === "active" ? 'active' : ''}`}>
                                        <span
                                            onClick={() => { setJobtype('active') }}
                                            className="menu_txt">Active Jobs</span>
                                    </span>
                                </li>
                                <li>
                                    <span className={`icon applied ${jobType === "open" ? 'active' : ''}`}>
                                        <span
                                            onClick={() => { setJobtype('open') }}
                                            className="menu_txt">Open jobs</span>
                                    </span>
                                </li>
                                <li>
                                    <span className={`icon past ${jobType === "past" ? 'active' : ''}`}>
                                        <span
                                            onClick={() => { setJobtype('past') }}
                                            className="menu_txt">Past jobs</span>
                                    </span>
                                </li>
                                <hr></hr>
                                <li>
                                    <span className="icon new">
                                        <span
                                            onClick={() => { setJobtype('applicant') }}
                                            className="menu_txt">
                                            {'New applicants'}
                                            {!!needApprovalCount && (
                                                <span className="badge_count">
                                                    {needApprovalCount > 9 ? '9+' : needApprovalCount}
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </li>
                                <li>
                                    <span className="icon approved">
                                        <span
                                            onClick={() => { setJobtype('approval') }}
                                            className="menu_txt">
                                            {'Need approval'}
                                            {!!newApplicantsCount && (
                                                <span className="badge_count">
                                                    {newApplicantsCount > 9 ? '9+' : newApplicantsCount}
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="detail_col">

                        {/* {jobType === 'active' && (
                            <ActiveJobsComponent
                                dataItems={dataItems}
                                jobType={jobType}
                            />)}
                        {jobType === 'open' && (
                            <OpenJobsComponent
                                dataItems={dataItems}
                                jobType={jobType}
                                setJobLabel={setJobLabel}
                            />)}
                        {jobType === 'past' && (
                            <PastJobsComponent
                                dataItems={dataItems}
                                jobType={jobType}
                            />)}
                        {jobType === "applicant" && (
                            <NewApplicantComponent
                                dataItems={dataItems}
                                jobType={jobType}
                                setJobLabel={setJobLabel}
                            />)} */}


                        {/* Milestone details */}

                        <div className="flex_row">
                            <div className="flex_col_sm_8">
                                <div className="relate">
                                    <button className="back"></button>
                                    <span className="xs_sub_title">Wire up circuit box</span>
                                </div>
                                <span className="sub_title">Milestone details</span>
                                <span className="xs_sub_title">Circuit board wiring complete</span>
                                <div className="upload_img_video">
                                    <figure className="img_video">
                                        <img src={media} alt="media" />
                                        {/* <img src={close} alt="remove" className="remove" /> */}
                                    </figure>
                                    <figure className="img_video">
                                        <img src={media} alt="media" />
                                    </figure>
                                    <figure className="img_video">
                                        <img src={media} alt="media" />
                                    </figure>
                                </div>
                                <div className="form_field">
                                    <span className="xs_sub_title">Discription</span>
                                    <p className="commn_para">Sparky wanted for a quick job to hook up two floodlights on the exterior of an apartment building to the main electrical grid. Current sparky away due to illness so need a quick replacement, walls are all prepped and just need lights wired. Can also provide free lunch on site and a bit of witty banter on request.</p>
                                </div>

                                <div className="form_field">
                                    <span className="xs_sub_title">Hours worked in this milestone</span>
                                    <span className="show_label">5 hours</span>
                                </div>
                                <button className="fill_btn full_btn">Approve</button>
                                <button className="fill_grey_btn full_btn mt-16">Decline</button>
                            </div>
                        </div>

                        {/* Milestone details close*/}




                    </div>
                </div>
            </div>
        </div>
    );
}


export default JobDashboard;