import React, { useState, useEffect, useMemo, startTransition } from "react";
import { Box, Text, useNavigate, Grid, Button, Icon } from "zmp-ui";
import CartHeader from "../header/cart-header";

const AllProduct: React.FunctionComponent = () => {
  const [flowers, setFlowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [perPage, setPerPage] = useState(0); // Số phần tử trên mỗi trang
  const navigate = useNavigate();

  const fado = "https://staging-shop.fado.vn/"

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer 1|CVPgFpL9i1kYdzGUrz02ySMn76kBoseALxXHHDL713f60738",
    apikey: "9cdfc6b4-2b4b-44b5-b427-b27c0dc32dfa",
    apiconnection: "appmobile",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/products?page[number]=${page}`,
          {
            method: "GET",
            headers: headers,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Lưu dữ liệu và thông tin phân trang
        setFlowers(data.data);
        setPerPage(data.per_page);
        setTotalPages(Math.ceil(data.total / data.per_page));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]); // Gọi lại API khi thay đổi số trang

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return <Text>Đang tải dữ liệu...</Text>;
  }

  return (
    <Box className="section-container-no-colors">
      <CartHeader/>
      <Grid columnSpace="1rem" columnCount={2}>
        {flowers.map((flower) => (
          <Box
            key={flower.id}
            className="section-container"
            onClick={() => startTransition(() => navigate(`/product/${flower.id}`))}
            style={{
              borderRadius: "8px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            
            <Box
              style={{
                width: "9em",
                height: "9em",
                backgroundImage: `url(${fado + flower.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            ></Box>
            <Text
              size="normal"
              bold
              style={{
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {flower.descriptions?.[1]?.name ?? "Không có tên"}
            </Text>
            <Grid columnCount={2} columnSpace="1rem" style={{ marginTop: "0.5rem" }}>
              <Box>{formatter.format(flower.price) + "₫"}</Box>
              <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button size="small" icon={<Icon icon="zi-plus-circle" />} />
              </Box>
            </Grid>
          </Box>
        ))}
      </Grid>

      {/* Phân trang */}
      <Box style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <Button
          size="small"
          disabled={page === 1}
          onClick={handlePrevious}
          style={{ marginRight: "1rem" }}
        >
          Trang trước
        </Button>
        <Text>
          Trang {page} / {totalPages}
        </Text>
        <Button
          size="small"
          disabled={page === totalPages}
          onClick={handleNext}
          style={{ marginLeft: "1rem" }}
        >
          Trang sau
        </Button>
      </Box>
    </Box>
  );
};

export default AllProduct;