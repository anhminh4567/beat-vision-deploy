import { Row, Col, TabContent, TabPane, TabContainer, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrackLicenseDto } from "@/types/ApplicationTypes/TrackLicenseType";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { PagingResponseDto } from "@/types/ApplicationTypes/PagingResponseType";
import { HttpClient } from "@/common";
import LicenseUploadForm from "./component/licenseUploadForm";
import { ButtonAllert2 } from "@/my-component/ButtonAllert";
export type ProjectsType = {
  icon: string;
  iconColor: string;
  title: string;
  date: string;
  fileSize: number;
};
const MockLicenseFiles: TrackLicenseDto[] = [
  {
    Id: 1,
    CurrentPrice: 0,
    DefaultPrice: 0,
    DistributionLimit: 9999,
    StreamLimit: 9999,
    IsMP3Supported: true,
    IsProducerTagged: false,
    IsWAVSupported: true,
    LicenceName: "Free license",
    LicensePdfBlobPath: "/private/license/freeLicense.pdf",
  },
  {
    Id: 2,
    CurrentPrice: 0,
    DefaultPrice: 0,
    DistributionLimit: 9999,
    StreamLimit: 9999,
    IsMP3Supported: true,
    IsProducerTagged: false,
    IsWAVSupported: true,
    LicenceName: "Paid license",
    LicensePdfBlobPath: "/private/license/paidLicense.pdf",
  },
];
export default function ProducerLicenses() {
  const [licenseFiles, setLicenseFiles] = useState(MockLicenseFiles);
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentPage, _setCurrentPage] = useState(0);
  const [_totalPage, setTotalPage] = useState(0);
  const [pageSize, _setPageSize] = useState(100);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const res: AxiosResponse<PagingResponseDto<TrackLicenseDto[]>> = await HttpClient.get(
        `/api/ManageTrack/get-track-license-paging?start=${currentPage}&amount=${pageSize}`
      );
      if (!res.data) {
        throw new Error("fail to fetch data");
      }
      let dataBody = res.data;
      console.log(dataBody);
      let totalItemCount = dataBody.TotalCount;
      let totalTracks = dataBody.Value;
      console.log(totalTracks);
      setLicenseFiles(totalTracks);
      setTotalPage(Math.ceil(totalItemCount / pageSize));
    } catch (error: any) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 403:
            case 401:
              navigate("/auth/login");
              break;
          }
          console.log(error);
        }
      }
    } finally {
    }
  };
  const downloadLicense = async (fileToDownload: TrackLicenseDto) => {
    let confirm = window.confirm("download file ?");
    if (confirm) {
      try {
        let result: AxiosResponse = await HttpClient.get(
          `/api/ManageTrack/download-track-license?licenseId=${fileToDownload.Id}`,
          {
            responseType: "blob",
          }
        );
        let url = URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = fileToDownload.LicenceName + ".pdf";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err: any) {
        console.log(err);
      }
    }
  };
  const deleteLicence = async (licenseId: number): Promise<boolean> => {
    try {
      const res: AxiosResponse<PagingResponseDto<TrackLicenseDto[]>> = await HttpClient.delete(
        `/api/ManageTrack/delete-license/${licenseId}`
      );
      if (res.status < 200 || res.status > 299) {
        throw new Error("fail to fetch data");
      }
      //fetchData();
      return true;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
        }
      }
      return false;
    }
  };
  useEffect(() => {
    fetchData().then((result) => {
      console.log(result);
    });
  }, []);
  return (
    <>
      <div>
        <div className="fs-1 border-bottom mb-3">Licenses Management</div>
        <Row className="border-bottom p-2 mb-3">
          <LicenseUploadForm
            isShow={isShowForm}
            setShowing={setIsShowForm}
          />
          <Col xs={10}>
            <Button
              variant="outline-primary"
              onClick={() => {
                setIsShowForm(true);
              }}
            >
              add license
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <TabContainer defaultActiveKey="1">
              <TabContent id="files-tabContent">
                <TabPane eventKey="1" className="fade" id="files-projects">
                  <h4 className="card-title mt-0 mb-3">Licenses</h4>
                  <div className="file-box-content">
                    {licenseFiles == undefined || licenseFiles.length == 0 ? <div>No License</div> : <>{licenseFiles.map((projects, idx) => (
                      <>
                        <div className="file-box" key={idx}>
                          <div className=" ">
                            <Link
                              to="#"
                              //download={`/api/ManageTrack/download-track-license?licenseId=${projects.Id}`}
                              className="download-icon-link"
                              onClick={() => {
                                downloadLicense(projects);
                              }}
                            >
                              <i className="dripicons-download file-download-icon"></i>
                            </Link>
                            {/* <Link to="#" className="download-icon-link">
                              <i className="dripicons-tag-delete"></i>
                            </Link> */}
                          </div>

                          <div className="text-center">
                            <i className={`far fa-file-pdf text-danger`}></i>
                            <h6 className="text-truncate">{projects.LicenceName}</h6>
                            <small className="text-muted">
                              default price : {projects.DefaultPrice.toString()}
                            </small>
                            <br />
                            <small className="text-muted">
                              current price : {projects.CurrentPrice.toString()}
                            </small>
                            <div>
                              <ButtonAllert2
                                onClickEvent={async (item: TrackLicenseDto) => {
                                  let result = await deleteLicence(item.Id);
                                  if (result) {
                                    await fetchData();
                                  }
                                  return result;
                                }}
                                item={projects}
                                className="btn-xs p-1 pt-0 pb-0"
                                text={"remove"}
                              ></ButtonAllert2>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}</>}
                  </div>
                </TabPane>
              </TabContent>
            </TabContainer>
          </Col>
        </Row>
      </div>
    </>
  );
}
