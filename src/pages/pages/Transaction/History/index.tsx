import { HttpClient } from "@/common";
import { useAuthContext } from "@/context";
import { OrderType } from "@/types/ApplicationTypes/OrderItemType";
import { PagingResponseDto } from "@/types/ApplicationTypes/PagingResponseType";
import { UserProfileDto } from "@/types/ApplicationTypes/UserProfileType";
import { AxiosResponse } from "axios";
import { createRef, useEffect, useState } from "react";
import { Col, Pagination, Row } from "react-bootstrap";
import { toast } from "sonner";

const PaymentHistory = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<OrderType[]>([]);
  const itemPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, _setTotalPage] = useState(0);
  const downloadRef = createRef<HTMLAnchorElement>();

  useEffect(() => {
    if (user?.userid) {
      GetPaymentHistory();
    } else setError("Can't get data");
  }, []);

  useEffect(() => {
    if (user?.userid) {
      GetPaymentHistory();
    }
  }, [currentPage]);

  const GetPaymentHistory = async () => {
    try {
      const get: AxiosResponse<UserProfileDto> = await HttpClient.get(
        "/api/ManageUser/identity/" + user?.userid
      );
      const userProfileId = get.data.Id;
      const res: AxiosResponse<PagingResponseDto<OrderType[]>> = await HttpClient.get(
        `/api/ManageOrder/get-order-range?userProfileId=${userProfileId}&start=${
          currentPage * itemPerPage
        }&take=${itemPerPage}`
      );
      if (res) {
        console.log(res);
        const tempt = [...res.data.Value.filter((p) => p.Status.toString() != "CANCELLED")];
        setOrders([...tempt]);
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  const HandleDownload = async (orderId: number, itemId: number, trackName: string) => {
    try {
      const get: AxiosResponse<UserProfileDto> = await HttpClient.get(
        "/api/ManageUser/identity/" + user?.userid
      );
      const userProfileId = get.data.Id;
      const res: AxiosResponse = await HttpClient.get(
        `/api/ManageTrack/download-bought-content?UserProfileId=${userProfileId}&OrderId=${orderId}&ItemId=${itemId}`,
        {
          headers: {
            "Content-Type": "application/zip",
          },
          responseType: "arraybuffer",
        }
      );
      if (res) {
        console.log(res.data);

        const content = new Blob([res.data], { type: "application/zip" });
        console.log(content);
        let url = URL.createObjectURL(content);
        console.log(url);
        console.log(downloadRef.current);
        downloadRef.current?.setAttribute("href", url);
        downloadRef.current?.setAttribute("download", `${trackName}.zip`);
        downloadRef.current?.click();
        downloadRef.current?.setAttribute("href", "");
        window.URL.revokeObjectURL(url);
        toast.info("Content downloading", { position: "bottom-right", duration: 2000 });
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Can't download right now", { position: "bottom-right", duration: 2000 });
    }
  };

  const renderPaging = () => {
    const pages = [];
    for (let i = 0; i < totalPage; i++) {
      if (i == 0) {
        pages.push(
          <>
            <Pagination.First key={0} active={false} onClick={() => setCurrentPage(0)} />
          </>
        );
      }
      pages.push(
        <>
          <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
            {i + 1}
          </Pagination.Item>
        </>
      );
    }
    pages.push(
      <>
        <Pagination.Last
          key={totalPage - 1}
          active={false}
          onClick={() => {
            setCurrentPage(totalPage - 1);
          }}
        />
      </>
    );
    return pages;
  };

  return (
    <>
      {error != "" ? (
        <div className="text-danger text-center mt-5" style={{ fontSize: "52px" }}>
          {error}
        </div>
      ) : (
        <>
          <Row className="d-flex justify-content-center mt-5">
            <Col lg={10}>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr style={{ backgroundColor: "rgba(96, 96, 96, 0.5)" }}>
                      <th className="text-warning">#</th>
                      <th className="text-warning">Order At</th>
                      <th className="text-warning">Price</th>
                      <th className="text-warning">Track</th>
                      <th className="text-warning">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      return (
                        <>
                          {order.OrderItems.map((item, idx) => {
                            return (
                              <tr key={idx} style={{ backgroundColor: "rgba(93, 99, 86, 0.6)" }}>
                                <td className="text-white">{idx}</td>
                                <td>
                                  <p className="d-inline-block align-middle mb-0 ms-1 text-white">
                                    {new Date(order.CreateDate).toLocaleDateString("vn-VN")}
                                    <br />
                                    <span className="text-white fw-bold font-13">
                                      {order.Status}
                                    </span>
                                  </p>
                                </td>
                                <td className="text-white">
                                  {" "}
                                  {order.Price != null
                                    ? order.Price > 0
                                      ? order.Price?.toLocaleString("vn-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        })
                                      : "Free"
                                    : "Null"}
                                </td>
                                <td>
                                  <ul className="list-inline mb-0">
                                    <li
                                      key={idx}
                                      className="list-inline-item align-middle fw-bold text-white"
                                    >
                                      {item.TrackName}
                                    </li>
                                  </ul>
                                </td>
                                <td>
                                  {order.Status.toString() == "PAID" ? (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-warning fw-bold text-white"
                                        onClick={(e) => {
                                          e.currentTarget.textContent = "Pending";
                                          e.currentTarget.disabled = true;
                                          HandleDownload(
                                            parseInt(order.Id),
                                            item.Id,
                                            item.TrackName
                                          );
                                          e.currentTarget.textContent = "Download";
                                          e.currentTarget.disabled = false;
                                        }}
                                      >
                                        Download
                                      </button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Col>
            <div>
              <Row className="d-flex justify-content-center align-content-center">
                <div>
                  <Pagination className="d-flex justify-content-center">
                    {renderPaging()}
                  </Pagination>
                </div>
              </Row>
            </div>
          </Row>
          <a ref={downloadRef} />
        </>
      )}
    </>
  );
};
export default PaymentHistory;
