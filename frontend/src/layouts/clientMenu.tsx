import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
// import { Category } from "../types/categories";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/userService";
import { toast } from "react-toastify";
import { Category } from "../types/categories";

const MenuClient = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("MenuClient phải được sử dụng trong AuthProvider");
  }
  const { auth, setAuth } = context;
  const { isAuthenticated, user } = auth;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fakeCategories: Category[] = [
      {
        _id: "1",
        name: "Nam",
        parentId: null,
        ancestors: [],
        level: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        _id: "2",
        name: "Nữ",
        parentId: null,
        ancestors: [],
        level: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        _id: "3",
        name: "Trẻ Trâu",
        parentId: null,
        ancestors: [],
        level: 0,
        createdAt: "",
        updatedAt: "",
      },
    ];
    setCategories(fakeCategories);
  }, []);

  const openDropdown = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  }, []);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      setAuth({
        isAuthenticated: false,
        isAuthenticating: false,
        user: { id: "", email: "", role: "" },
      });
      toast.success("Đăng xuất thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error("Đăng xuất thất bại!", {
        position: "top-right",
        autoClose: 2000,
      });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <header className="grid grid-cols-[1fr_0.3fr_1fr] items-center py-5 bg-white fixed top-0 w-[90%] z-50 shadow-sm">
    {/* Left menu - Categories */}
    <div className="flex items-center justify-start">
      {categories.map((category) => (
        <div key={category._id} className="relative group">
          <Link
            to={`/category/${category._id}`}
            className="text-[14px] font-semibold text-gray-800 mr-6 hover:text-red-500 transition-all duration-300"
          >
            {category.name.toUpperCase()}
          </Link>
        </div>
      ))}
      <Link
        to="/sale"
        className="text-[14px] font-semibold text-[rgb(255,0,0)] mr-6 hover:text-red-600 transition-all duration-300"
      >
        THÁNG VÀNG SĂN SALE
      </Link>
      <Link
        to="/collection"
        className="text-[14px] font-semibold text-gray-800 mr-6 hover:text-red-500 transition-all duration-300"
      >
        BỘ SƯU TẬP
      </Link>
      <Link
        to="/about"
        className="text-[14px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300"
      >
        VỀ CHÚNG TÔI
      </Link>
    </div>
  
    {/* Center Logo */}
    <div className="flex justify-center items-center">
      <Link to="/">
        <img src="/images/logo.png" alt="Logo" className="w-36 h-auto" />
      </Link>
    </div>
  
    {/* Right side - Search, Support, User, Cart */}
    <div className="flex items-center justify-end">
      <div className="w-80 h-10 border flex rounded-lg">
        <div className="flex px-3 gap-3 items-center">
          <Link to="/search">
            <img src="/svg/search.svg" alt="Search" className="w-5 h-auto" />
          </Link>
          <input
            type="text"
            name="searchname"
            id="searchname"
            placeholder="TÌM KIẾM SẢN PHẨM"
            className="text-sm p-2 outline-none border-0 focus:outline-none focus:ring-0"
          />
        </div>
      </div>
      <Link to="/support" className="ml-6">
        <img src="/svg/headphone.svg" alt="Support" className="w-5 h-auto" />
      </Link>
  
      {/* Dropdown user menu */}
      <div
        className="relative ml-6 cursor-pointer"
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdown}
      >
        <img src="/svg/user.svg" alt="User" className="w-5 h-auto" />
  
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg z-50"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            {isAuthenticated ? (
              <>
                <span className="block w-full px-4 py-4 text-sm font-semibold text-gray-800">
                  Tài khoản của tôi
                </span>
                <hr />
                <Link
                  to="/account"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                >
                  Thông tin tài khoản
                </Link>
                {user.role === "3" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  >
                    Quản trị admin
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                >
                  Đơn hàng của tôi
                </Link>
                <Link
                  to="/viewed-products"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                >
                  Sản phẩm đã xem
                </Link>
                <Link
                  to="/favorites"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                >
                  Sản phẩm yêu thích
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={mutation.isPending}
                  className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200 ${
                    mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {mutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </div>
  
      {/* Cart */}
      <Link to="/cart" className="ml-6">
        <img src="/svg/cart.svg" alt="Cart" className="w-5 h-auto" />
      </Link>
    </div>
  </header>
  
  );
};

export default MenuClient;
