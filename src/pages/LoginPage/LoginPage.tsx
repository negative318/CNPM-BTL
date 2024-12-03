import { Link, useNavigate } from "react-router-dom";
import mainPath from "../../constants/path";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import MainFooter from "../../components/MainFooter";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/app.context";
import axios from "axios";

export default function LoginPage() {
  const { setIsAuthenticated, setProfile, setLoadingPage } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPage(true);
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
      });
  
      const userData = {
        _id: response.data.id,
        name: `${response.data.firstName} ${response.data.lastName}`,
        email: response.data.email,
        role: response.data.roles[0]?.id || 3,
        jwtToken: response.data.jwttoken,
      };
  
      localStorage.setItem("userProfile", JSON.stringify(userData));
      localStorage.setItem("jwtToken", userData.jwtToken);
  
      setIsAuthenticated(true);
      setProfile(userData);
      setLoadingPage(false);
  
      navigate(mainPath.home);
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div
      className="flex flex-col justify-between h-full min-h-full"
      style={{ minHeight: "inherit" }}
    >
      <div>
        {/* Thanh điều hướng */}
        <div className="w-full bg-webColor700">
          <div className="container">
            <div className="flex justify-start w-full">
              <Link
                to={mainPath.home}
                className="flex px-6 py-4 space-x-2 text-lightText hover:bg-hoveringBg"
              >
                <FontAwesomeIcon icon={faCaretLeft} />
                <p className="font-semibold uppercase">Trang chủ</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Phần chính: Đăng nhập */}
        <div className="container flex items-center justify-center py-10 min-h-[80vh]">
          <div className="w-full max-w-md p-5 bg-white shadow-lg rounded-xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 uppercase">
                Đăng nhập tài khoản
              </h2>
            </div>

            {/* Form đăng nhập */}
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 font-medium text-gray-600"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="mb-4 text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}
