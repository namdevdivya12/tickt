import { Component } from 'react';
import PersonalInformationComponent from './components/personalInformation/personalInformation';
import BankingDetailsComponent from './components/bankingDetails';
import SettingsComponent from './components/settings';
import SupportChatComponent from './components/supportChat';
import PrivacyPolicyComponent from './components/privacyPolicy';
import TermsOfUseComponent from './components/termsOfUse';

import menu from '../../assets/images/menu-line-blue.png';
import close from '../../assets/images/ic-cancel-blue.png';
import storageService from '../../utils/storageService';
import CardDetails from './components/cardDetails';
import MilestoneTemplates from './components/milestones/milestoneTemplates';

interface BankDetails {
  userId: string;
  account_name: string;
  account_number: string;
  bsb_number: string;
}

interface Settings {
  messages: {
    email: boolean,
    pushNotification: boolean,
    smsMessages: boolean,
  },
  reminders: {
    email: boolean,
    pushNotification: boolean,
    smsMessages: boolean,
  },
}

interface Props {
    tradieProfileViewData: any,
    history: any,
    getTradieProfileView: () => void,
    getBankDetails: () => void,
    addBankDetails: (data: any) => void,
    updateBankDetails: (data: any) => void,
    bankDetails: BankDetails,
    getSettings: () => void;
    updateSettings: (settings: any, newSettings: any) => void;
    settings: Settings,
}

interface State {
    activeMenuType: string,
    isToggleSidebar: boolean,
}

class TradieEditProfile extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            activeMenuType: 'personal-information',
            isToggleSidebar: false,
        }
    }

    componentDidMount() {
        // this.props.getTradieProfileView();
    }

    toggleSidebar = () => this.setState({ isToggleSidebar: !this.state.isToggleSidebar });

    setSelected = (menuType: string) => {
        const { getTradieProfileView } = this.props;
        const dataItems = ['personal-information', 'banking-details', 'milestone-templates', 'settings', 'support-chat', 'privacy-policy', 'terms-of-use'];
        if (this.state.activeMenuType !== menuType && dataItems.includes(menuType)) {
            this.setState({ activeMenuType: menuType }, () => {
                if (menuType === 'personal-information') { getTradieProfileView(); }
            });
        }
    }


    render() {
        let props: any = this.props;
        console.log(this.state, "state--------------", props, "props------------");
        let {
            activeMenuType,
            isToggleSidebar,
        } = this.state;
        const USER_TYPE = storageService.getItem('userType');
        return (
            <div className="app_wrapper">
                <div className="custom_container">
                    <span
                        className="mob_side_nav"
                        onClick={() => this.toggleSidebar()}
                    >
                        <img src={menu} alt="mob-side-nav" />
                    </span>
                    <div className="f_row">
                        <div className={`side_nav_col${isToggleSidebar ? ' active' : ''}`}>
                            <button className="close_nav" onClick={() => this.toggleSidebar()}>
                                <img src={close} alt="close" />
                            </button>
                            <div className="stick">
                                <span className="title">My Profile</span>
                                <ul className="dashboard_menu">
                                    <li
                                        onClick={() => {
                                            console.log('current!!!!!!!')
                                            this.setSelected('personal-information');
                                        }}
                                    >
                                        <span className={`icon applicants ${activeMenuType === 'personal-information' ? 'active' : ''}`}>
                                            <span className="menu_txt">Personal Information</span>
                                        </span>
                                    </li>
                                    {USER_TYPE === 2 ? (
                                        <li onClick={() => { this.setSelected('banking-details') }}>
                                            <span className={`icon wallet ${activeMenuType === 'banking-details' ? 'active' : ''}`}>
                                                <span className="menu_txt"> Payment Details</span>
                                            </span>
                                        </li>
                                    ) : (
                                        <li onClick={() => { this.setSelected('banking-details') }}>
                                            <span className={`icon wallet ${activeMenuType === 'banking-details' ? 'active' : ''}`}>
                                                <span className="menu_txt">Banking Details</span>
                                            </span>
                                        </li>
                                    )}

                                    {USER_TYPE === 2 && (
                                        <li onClick={() => { this.setSelected('milestone-templates') }}>
                                            <span className={`icon template ${activeMenuType === 'milestone-templates' ? 'active' : ''}`}>
                                                <span className="menu_txt">Milestone Templates</span>
                                            </span>
                                        </li>
                                    )}
                                    <li onClick={() => { this.setSelected('settings') }}>
                                        <span className={`icon settings ${activeMenuType === 'settings' ? 'active' : ''}`}>
                                            <span className="menu_txt">Settings</span>
                                        </span>
                                    </li>
                                    <li>
                                        {/* <li onClick={() => { this.setSelected('support-chat') }}> */}
                                        {/* <a className={`icon chat ${activeMenuType === 'support-chat' ? 'active' : ''}`}>
                                            <span className="menu_txt">Support Chat</span>
                                        </a> */}
                                    </li>
                                    <li onClick={() => { this.setSelected('privacy-policy') }}>
                                        <span className={`icon tnc ${activeMenuType === 'privacy-policy' ? 'active' : ''}`}>
                                            <span className="menu_txt">Privacy Policy</span>
                                        </span>
                                    </li>
                                    <li onClick={() => { this.setSelected('terms-of-use') }}>
                                        <span className={`icon tnc ${activeMenuType === 'terms-of-use' ? 'active' : ''}`}>
                                            <span className="menu_txt">Terms Of Use</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="detail_col profile_info">
                            {activeMenuType === 'personal-information' && (
                                <PersonalInformationComponent
                                    {...props}
                                />)}
                            {activeMenuType === 'banking-details' && USER_TYPE === 1 ?
                                (<BankingDetailsComponent
                                    {...props}
                                />) : null}

                            {activeMenuType === 'banking-details' && USER_TYPE === 2 ?
                                (<CardDetails
                                    {...props}
                                />) : null}

                            {activeMenuType === "milestone-templates" && USER_TYPE === 2 ? (
                                <MilestoneTemplates
                                    {...props}
                                />
                            ) : null}

                            {activeMenuType === 'settings' && (
                                <SettingsComponent
                                    {...props}
                                />)}
                            {activeMenuType === 'support-chat' && (
                                <SupportChatComponent
                                    {...props}
                                />)}
                            {activeMenuType === 'privacy-policy' && (
                                <PrivacyPolicyComponent
                                    {...props}
                                />)}
                            {activeMenuType === 'terms-of-use' && (
                                <TermsOfUseComponent
                                    {...props}
                                />)}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default TradieEditProfile;
