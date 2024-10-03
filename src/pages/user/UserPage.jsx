import { useEffect, useState } from "react";
import Util from "../../util/Util";
import { Alert, Avatar, Button, Card, Col, Input, List, Modal, Row, Typography } from "antd";
import { toast } from "react-toastify";
import UserService from "./../../services/UserService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "./../../services/PostService";
import ConvertPoint from "./Point";
import TransactionUser from "./TransactionUser";

const UserPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [userLogin, setUserLogin] = useState();
    const [posts, setPosts] = useState([]);

    // const [load, setLoad] = useState(true);
    const [name, setName] = useState("");
    const handleChange = (e) => {
        setName(e.target.value.trim());
    };
    // modal
    // Open Modal lịch sử hóa đơn
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const updateUserName = () => {
        if (name.trim().length == 0) {
            toast.warning("nhập user name");
            return;
        }
        const user = {
            ...Util.User,
            username: name,
        };
        // update name
        UserService.update(user.id, user)
            .then((res) => {
                // console.log(res);
                toast.success("Cập nhât thành công");
                Util.setUser(user); // cập nhật lại thông tin người dùng trong Util
                setUserLogin(user); // cập nhật lại state
                handleCancel();
                // setLoad(!load);
            })
            .catch((err) => {
                toast.warning("Cập nhât thất bại ");
                console.log(err);
            });
    };

    // lấy account user qua id params
    const fetchUser = async () => {
        // const user = await localStorage.getItem("user");
        UserService.getById(params.id)
            .then((response) => {
                // console.log(response.data);
                setUserLogin({
                    ...response.data,
                });
            })
            .catch((err) => {
                console.log("err ", err);
            });
    };

    // lấy danh sách posts user qua id params
    const fetchPosts = async () => {
        PostService.getPostsByUserId(params.id)
            .then((response) => {
                setPosts([...response.data]);
            })
            .catch((err) => {
                console.log("err ", err);
            });
    };
    useEffect(() => {
        fetchPosts();
        fetchUser();
    }, []);

    return (
        <div>
            <Row gutter={[12, 5]}>
                {/* begin profile */}
                <Col span={24}>
                    <Card
                        style={{ height: "100%", width: "100%", padding: "30px" }}
                        title={"Thông tin "}
                        extra={
                            <Button
                                onClick={() => {
                                    if (!Util.User) {
                                        toast.warning("Vui lòng kết nối ví phantom");
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                type="primary"
                            >
                                Edit
                            </Button>
                        }
                    >
                        <Row justify="center" style={{ flex: 1 }}>
                            <Col lg={4} md={24} sm={24}>
                                <Typography.Title level={5}>Name </Typography.Title>
                            </Col>
                            <Col lg={20} md={24} sm={20}>
                                <Typography.Title level={5}>
                                    : {userLogin?.username}
                                </Typography.Title>
                            </Col>
                            <Col lg={4} md={24} sm={24}>
                                <Typography.Title level={5}>Publickey </Typography.Title>
                            </Col>
                            <Col lg={20} md={24} sm={20}>
                                <Typography.Title level={5}>
                                    : {userLogin?.publickey}
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <Typography.Title level={5}>Point </Typography.Title>
                            </Col>
                            <Col span={6}>
                                <Typography.Title level={5}>: {userLogin?.point}</Typography.Title>
                            </Col>
                            <Col span={14}>
                                {/* đổi poitn  */}
                                {/* <ConvertPoint totalPoint={userLogin?.point} /> */}
                            </Col>
                        </Row>
                    </Card>
                </Col>
                {/* end profile */}

                {/* begin list post  */}
                <Col span={24}>
                    <Card title={"Danh sách bài đăng"} style={{ width: "100%", padding: "30px" }}>
                        {posts.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                pagination={{
                                    position: "bottom",
                                    onChange: (page) => {
                                        console.log(page);
                                    },
                                    pageSize: 5,
                                }}
                                dataSource={posts}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <Alert
                                            message={
                                                <List.Item.Meta
                                                    title={
                                                        <a
                                                            onClick={() => {
                                                                navigate("/post/" + item.id);
                                                            }}
                                                            style={{ textDecoration: "none" }}
                                                        >
                                                            {item.title}
                                                        </a>
                                                    }
                                                    description={"" + item.createAt}
                                                />
                                            }
                                            type="info"
                                        />

                                        {/* {item.content} */}
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Typography.Text>Không có bài đăng nào.</Typography.Text>
                        )}
                    </Card>
                </Col>
                 {/* end list post  */}

                {/* begin list transaction */}
                <Col span={24}>
                    <TransactionUser />
                </Col>
                {/* end list transaction */}
            </Row>

            {/*  */}

            <Modal width={"50%"} open={isModalOpen} onCancel={handleCancel} footer={false}>
                <Typography.Text>Username: </Typography.Text>
                <Input placeholder="nhập username" onChange={(e) => handleChange(e)} />
                <Row>
                    <Col span={24}>
                        <div className="d-flex justify-content-end mt-2">
                            <Button onClick={updateUserName} type="primary">
                                Thay đổi
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default UserPage;
