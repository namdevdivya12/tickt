import { Component } from 'react'
// import { getTnc } from '../../../redux/profile/actions';
import {setLoading} from '../../../redux/common/actions'
interface Props {
}

interface State {
    isToggleSidebar: boolean,
    url: string,
}

export class TermsOfUse extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            isToggleSidebar: false,
            url: '',
        }
    }

    // componentDidMount = async () => {
    //   const { data: { privacyPolicy_url } } = await getTnc();
    //   this.setState({
    //     url: privacyPolicy_url,
    //   })
    // }

    render() {
        let props: any = this.props;
        let url: any = props.privacyPolicy_url;
        console.log({url,props},'---url')
        if(!url){
            setLoading(true);
        }
        return (
            <div className="h-75vh">
                {/* <span className="sub_title">Terms of use</span> */}
                {url && <iframe src={url} title="Privacy Policy" width="100%" height="100%" />}
            </div>
        )
    }
}

export default TermsOfUse;
