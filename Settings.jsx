const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = class MarkdownifySettings extends React.PureComponent {
    render() {
        return(
            <div className="markdownifySettings">
                <div className="description-3_Ncsb formText-3fs7AJ marginBottom20-32qID7 modeDefault-3a2Ph1 primary-jw0I4K">
                    Flood your messages with unnnecessary markdown!
                </div>
                <div className="markdownifySettingsMainContainer">
                    <SwitchItem
                        className = "markdownifySettingsToggleFloodSwitch"
                        value = {this.props.getSetting("markdownFlood", false)}
                        onChange = {(arg) => {
                            this.props.updateSetting("markdownFlood", arg);
                        }}>
                        Toggle Markdownification
                    </SwitchItem>
                    <div className="description-3_Ncsb formText-3fs7AJ marginBottom20-32qID7 modeDefault-3a2Ph1 primary-jw0I4K">
                        Auto-markdownifies your messages so that you don't need to run the command every time
                    </div>
                </div>
                <style>
                {`
                    @keyframes loadIn {
                        from {
                            opacity: 0;
                            margin-top: -10px;
                        }
                        to {
                            opacity: 1;
                            margin-top: 0;
                        }
                    }

                    .markdownifySettingsMainContainer {
                        background: var(--background-secondary);
                        backdrop-filter: blur(10px);
                        border-radius: 10px;
                        box-shadow: var(--elevation-high);
                        padding: 20px 20px 20px 20px;
                        animation-name: loadIn;
                        animation-duration: 0.69s;
                        animation-iteration-count: 1;
                        margin-top: 0;
                    }
                `}
                </style>
            </div>
        )
    }
}