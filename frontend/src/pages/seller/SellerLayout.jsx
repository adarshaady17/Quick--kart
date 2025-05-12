import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { NavLink, Outlet, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerLayout = () => {
    const { axios, navigate, setIsSeller } = useAppContext();
    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/v1/seller/logout', {
                withCredentials: true // Important for cookies
            });
            
            if (data.success) {
                setIsSeller(false);
                localStorage.removeItem('sellerAuth'); // Clear any client-side storage
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API fails
            setIsSeller(false);
            localStorage.removeItem('sellerAuth');
            toast.error(error.response?.data?.message || 'Logout failed');
            navigate('/');
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <div className="hidden sm:flex items-center gap-8">
                    <Link to='/'>
                        <img className="h-9" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALwAxwMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcEBQgDAgH/xABMEAABAwICBQcIBAoIBwAAAAAAAQIDBAUGEQcSIVFhEyIxMkFxgRQjQlJikaGxM0NTchUkRGNzgpKywfAWJVR0lMLS4Rc0NZOiw9H/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIEAwX/xAAkEQEAAgICAgIDAAMAAAAAAAAAAQIDERIhBDETQTJRcRQjM//aAAwDAQACEQMRAD8ApwAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAy7ZbK27VjaS200lTO76uPdvVV2InFckEzEe0wxAWxZdD8TIPKcTXhsLGt1nx02SIxPakemXw8T1lpdENvfyUk61bm+k2aolb72bDjOevqO1uE/aogXRQ2bRbe3tjt7oGzO6GeUzRPd3I9UzXwPG8aIKB7XOs9wqKZ/oxz5SM7s0RFTv2nP/AC8cTq3S3wzPrtToNxiHDV1w5O2O502q1ztVk0fPif3Lv4LkvA05praLRuO4c5iY9gBNrDR4Bu9wgoJf6Q0UtQ5GMfJNC5muq5Ii5MzTNdmeWW3sEzohCQXZNoesEfRXXX/uR/6CBYptmFbFXT22F13qauFvOk5SNGNeqZoi83Ncs0z2FK5YtOoTxn7RAAkuCbJb7/Uz0lZ5Y2SNuu2SFzUY1M0TJc0Vc1VVy7uBe1uMblERudI0CyrngbDVrpvKbhdK6CP0daRmsq7mojM1XghDrk7DaQyNtcd3dL6Ek8kaM6elURM8su5SlckXjdVppppgAdFAAAAAAAAAH6iKq7DYUtFRsXWutdyLfsYG8pM7huZ4rnwEzpOmuVck2k+wtiC/0FAykwnhfrbZKl0L5XSr6yvTJETcnQhJ9H1rsdRb219FaOT84rY5qlySyu1diu3N25pkm432NsSS4XsTa2nijknkqGRMjkz1dqKq55Ln0Iphv5PO3xxV2jHqOSA3+zaSMVcn+EbbI6CPqwNkijZn6yor9q8VzNFNo7xfEnPsc36s0b/k5SW0WmqriX8asdPJ+hqXM+bXEkt2mHDtU7VroKyid60kfKN/8FVfgX5Z6R1RXVZn2pausN3oGuWvtVdA1vWdJTORPfll8SZ6PdIM9vmitt6qXTW9ztRlRI7N1OvZmq7VZ39HdsLjtt8td4ZrWq4U9X6zYpEVze9OlPFDBvGGrHdUd+EbVSzOd9ZyaI/9tMl+JmyeXW8TTLV3x4Zid1lmVdHTXCkkpa2COammTJ7H7UX/AH49hQGPcKS4VvHIt1pKGozfSyO3J0tXimad6Ki9p0DQU7KSlgpodbkoWoxms5VXJNiIqrtXZ2mk0kWF+IMJ1MFNFylXTuSema3pcqbFRO9FVO/Iz+Dm4W4/S+enKNz7c6GbY1yvlsy/tcX76HhW0lTQS8lXU01NL9nPG6NfcqIp72X/AK1b/wC9xfvoe5MxPpgjbqOr9I5sx0ueMrzn/aV+SHSdV6Rzvia21d2x/dKKgi5SeSpX7rU2ZucvYib/AOJkwflO3W8TNdQ0Nst9VdK2Okoo+Ulk/ZRO1V3Im8s9r7XgGxaq+eqZOdq9D6h+/g1Pgm9V2+ciWzR/Z9VPxi4TeDp1T91ifzmqkB5O8YpuMtQ2KSond1pG7GRInQma7Gom7P3qWn/bO5/FOop/WNeLtWXmtdV18us70W+ixNyJ2J8+0wTKrYKemdyEU7amVv0kkf0Xc3Pa7v2JuTtMU0xERGojpymZ+wABAAAAAAAAAABoX1gKNsWFLWxvpQI/xdtX4qaXTTn/AEft/wDff/W42WjaqSqwnQ5daFqwu/VVUT4ZL4nzpaoXVeDXzM61HPHN4bWL4c7PwPGx9eTO/wBtt/8Amo8+mOai89ut+sqe7+VPkHs7YmZTwwvka6lrPJp29Xls27eEibM+K6qcSV0OOMXYc5Ntc51TTO+j8tbrNensyovO781QhBmW6611s1vIp3RxSdeF2T4n/eYqKjvFCl6VvGpja1bTWelwWLSvZavVbdIprdL630kXvRM08U8SwbVcKG5w8tbqyGrj9aGRHe/JdhTODsN2vHVJVyz0bbZPTua3laByoyVXIvTG7NG5ZJ0KmefYfdZonxFbZ/KbFcYZ3N6ro5HU0vcm3L4oebODBz41nUtPPJMbleUtLT1sPIVkEM8TutHNGj2u8FTIj1bo8wnJUxVbLRDTzxuR7XUznRtzRc02IqIu1NxV8N30qYd1WzQXGpib9tTpUt8XtzXxzMj/AIwYppvNXGx0ut7UMsTvHNVNVMVqxqJcJtEyt2qI1DaaO31VdU08Xn6yRXzyO6ztze5NxA36UcT16atvw9DrezDLL8sjxkTSNf8Amy61ugd92n+Wbyk4rfc6dIvDaYlhwxb62SvvWrU1cnVjkcsjsk6ESPPJE8ETiRKuu95xX+IWSidTW9vNdFDkjMvzj9iInDo7yRWzR7RUsvLXad1fP1nN2tZnx25u8V8DXaRn3SihjpKdrYbI5qI1tO3Vbn6r8uhNydCk45ryisTuU23raFV0FLSLyEM7audv0k0f0TeDc9ru/Ym5O0wwDb/WYAAAAAAAAAAAAEif6Jb6yjuUtpqXasVY7Wid+dRMsvFE96InaXDPSQ3CinpKputBURrE9vByZKcwMVWOa5rnNc3nI5uzJexU4lyYC0i01bFHQYglbBVt5rKl2xk+7NehrvgvZuPP8vx7cvko0Y7xMcZVZiKzVOH7vNbaxvOhdzX6uSSNXocnBU9y5p2GtOmcU4StuLre2Cu1o54+dBUx5a7M+/YqL2p8l2lOX3Rfia1Su8npm3GDskpnJnlxYuSovBM+874vIreNW9uV6anpCQbdmFsRSS8m2x3PW9qlenxVMicYO0X1bqmKsxK1sULec2k1kc567n5bEThmqr0bC+TPjxVm0yVx2tOoS3RPaX2vCUEkzdWWskWoc3gqIjfgiL4kS0x4qSqq4rFb5fN0snK1MkblTzqdDUVN2aqvFU7UJZpEvV6tFp1bHb5nazefWsaitp04Im3PiqZJx7KEVyq7Wc7W1tufTnvUxeHj+S85rfbvmvxjhCT2nSBiu0o1tLeaiWJv1dTlMndzkVUTuVCWWfTHiKpuNJSVVLbZGTTMic5sb2u5yomfXVO3cVYbfB1PJW4stFNDznOrYnardzXI5V8ERVPQtWumaHTVWqlDY7xZfExBcrbDXSQU0Mysa2FqMdlknSqJn27y+Ko5y0jwvpsaXTlm6vKPR7M+1Fam1N6Z5p3oplwRHLt1v+LMwRix9sn8iucrnUMjtZskjlXknqu1Vz7FXp3Lt3loVNNBW0slNUxtkgkbqua7oVP57SgCcYGxi2ha223aX8W6sFQ76r2V9ncvZ3dFs+Gfyr7TjyajUtRi7DE+HqrWbrSUMjvNTer7LuPHt96EeOg54KevpXQzxxzU0zdrV2oqL/PSVVirA9baZHT25slXQ9bmtzfFwVE2qnFPHInDn5dW9oyYtd19IiD8RzV6HH6aXEAAAAAAAAAAAAAbyx4txBYWtbarrNHG36p2UjPBjkVE8MiTw6YsSsTzsFtm9p0T0+T8vgV4Ck46W9wmLTHpYU+l/EcqcyC2w/dievzea6k0lYngr/KZ61tS30oJImoxyZ9CaqIqLxz78yHAr8GL1xW+S37dB4Rx3aMRK2FH+SXB35NM5OcvbqL0O+C8D2xHo8sOIVdI6DyKrd+UU2Say73J0O92fE52J9hPSld7NqwXT+s6RvN847KZicH+l3O96GSfDnHblhl1+aLRq8MXEujPENk1pIIPwjSN+tpGqrmpxj6U8M04mDbseYktNJHSW+shp2wt5JurRQ66ImxEVVbmq9+3eXvhjHeHcQI1tHcI46l35NU5Ry59OSIq5O/VVTLxJhGwX9Ne62yGSX7dM45f2m5Kvcp3pln1khzmsfSgXaRsXv615d/hof8AQeMuO8Rzpq1FdHN+kpIl/wApPbvocos9a1XWeH83UsSRO5FRUX5kWqtF18gXzdVQyN9bXe1fcrf4l+eJGroVLI6WV0knWkcrnarUTaq5rkibE7kPglyaOr2i+cloY2+k50rv4NMWos9htbv6xvPlsjfye3MR3eivVVRPmXjJWeoRwt9tbbL/AHe1M5O33CaGL7PY5vgjkVENomPcSon/ADzf8PH/APCNyqx0r+Sa5sesuq1zs1amexFXtXLtPkmaVn3CeUx02t3xFc7xFydwljkbra3Np42Oz70TPt3mqALRGulQABAAAAAAAAAAAAAAAAAAACoiptNvbcUX+1t1aC9V0LW9WPllVngi5p8DUAdJ7StukfFyJzrxrfep4l/ynhPjzFE/Xurm/o4Y0+TSNgrwp+jlLLrbnX3Bfx6uqKj2ZJFVPdnl8DEALaiDsAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9k=" alt="dummyLogoColored" />
                    </Link>
                    <b>Quick-Kart</b>
                </div>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button 
                        onClick={logout}
                        className='px-8 py-2.5 bg-indigo-500 text-white font-medium rounded cursor-pointer hover:bg-indigo-600 transition-colors'
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item) => (
                        <NavLink 
                            to={item.path} 
                            key={item.name} 
                            end={item.path === "/seller"}
                            className={({isActive}) => `flex items-center py-3 px-4 gap-3 
                                ${isActive ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                                    : "hover:bg-gray-100/90 border-white text-gray-700"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className='w-7 h-7'/>
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet/>
            </div>
        </>
    )
}

export default SellerLayout;