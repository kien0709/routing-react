import { Box, Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { FiArchive, FiBell, FiDatabase } from "react-icons/fi";
import HeaderActions from "../components/HeaderActions";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import DashboardChart from "../components/dashboard/DashboardChart";
import MetricCard from "../components/dashboard/MetricCard";
import TakedownNotifications from "../components/dashboard/TakedownNotifications";
import TopAdminCard from "../components/dashboard/TopAdminCard";
import TopFakeSellersList from "../components/dashboard/TopFakeSellersList";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });

  return (
    <Flex bg="bg.muted" minH="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar />

      <Box flex="1" minW={0} p={{ base: 4, md: 8 }} position="relative">
        <Box
          color="fg"
          fontSize="15px"
          fontWeight="medium"
          left={{ base: "16px", md: "40px" }}
          opacity={1}
          position="absolute"
          top="140px"
        >
          {currentDate}
        </Box>

        <Flex
          align={{ base: "stretch", lg: "flex-start" }}
          direction={{ base: "column", lg: "row" }}
          gap={6}
          justify="space-between"
          mb={6}
          w="100%"
        >
          <Box>
            <Heading size="xl" mb={2}>
              Dashboard
            </Heading>
            <Text color="fg">
              Overview of your platform activity
            </Text>
          </Box>

          <HeaderActions />
        </Flex>

        <Flex align="center" gap={3} justify="flex-end" mb={6} w="100%" wrap="wrap">
          <Text color="fg.muted" fontSize="12px">
            Choose Platform :
          </Text>
          <Button bg="bg.panel" color="fg" size="sm" variant="ghost">
            Alibaba
          </Button>
          <Button bg="bg.panel" color="fg" size="sm" variant="ghost">
            AliExpress
          </Button>
          <Button bg="var(--color-primary)" color="white" size="sm" _hover={{ bg: "var(--color-primary-hover)" }}>
            All
          </Button>
        </Flex>

        <Grid
          gap={4}
          templateColumns={{
            base: "minmax(0, 1fr)",
            lg: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          }}
        >
          <GridItem>
            <MetricCard
              icon={<FiArchive size={20} />}
              label="Number of Takedowns"
              value="593568"
            />
          </GridItem>

          <GridItem>
            <MetricCard
              icon={<FiDatabase size={20} />}
              label="% of Goods Scraped"
              value="92.85%"
            />
          </GridItem>

          <GridItem>
            <MetricCard
              icon={<FiBell size={20} />}
              label="New Notices"
              rightContent={<DashboardChart />}
              trend={null}
              value="2395"
            />
          </GridItem>

          <GridItem colSpan={{ base: 1, xl: 2 }}>
            <Box
              bg="bg.panel"
              borderRadius="16px"
              display="flex"
              flexDirection="column"
              h={{ base: "430px", md: "380px", xl: "336px" }}
              opacity={1}
              overflow="hidden"
              p={{ base: 4, md: 5 }}
              w="100%"
            >
              <Text color="fg" mb={2}>
                Analytics
              </Text>
              <Flex
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={4}
                justify="space-between"
                mb={4}
                wrap="wrap"
              >
                <Heading size="md" color="fg"></Heading>

                <Flex gap={{ base: 2, md: 4 }} wrap="wrap">
                  <Flex align="center" gap={2}>
                    <Box bg="var(--color-chart-removed)" borderRadius="full" h="10px" w="10px" />
                    <Text color="fg" fontSize="sm">
                      Listing removed
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Box bg="var(--color-chart-sent)" borderRadius="full" h="10px" w="10px" />
                    <Text color="fg" fontSize="sm">
                      Notices sent
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Box bg="var(--color-chart-rejected)" borderRadius="full" h="10px" w="10px" />
                    <Text color="fg" fontSize="sm">
                      Notices rejected
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <AnalyticsChart />
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg="bg.panel"
              borderRadius="16px"
              h="337px"
              opacity={1}
              p={5}
              w="100%"
            >
              <TopFakeSellersList />
            </Box>
          </GridItem>

        </Grid>

        <Grid
          gap={4}
          mt={4}
          templateColumns={{ base: "minmax(0, 1fr)", xl: "minmax(0, 2fr) minmax(375px, 1fr)" }}
        >
          <TakedownNotifications />
          <TopAdminCard />
        </Grid>
      </Box>
    </Flex>
  );
}
