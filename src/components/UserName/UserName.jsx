import './username.css'
export const UserName = ({username}) => {
    const userNameFirstLetter = username[0];
    return (
        <div className='username'>
            {userNameFirstLetter}
        </div>
    )
}
