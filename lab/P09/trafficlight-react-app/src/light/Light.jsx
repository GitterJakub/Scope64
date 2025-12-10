const Light = ({color, active}) => (
    <div className="light" style={{backgroundColor: color, opacity: active ? 1 : 0.3}}/>)

export default Light