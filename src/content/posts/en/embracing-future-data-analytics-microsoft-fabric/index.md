---
date: 2023-06-15
title: Embracing the Future of Data Analytics with Microsoft Fabric
tags: [data, analytics, data engineering, microsoft data platform, data science]
image: './header.webp'
authors:
  - rui-machado

---

Launched on May 24, 2023, Microsoft Fabric is an innovative cloud-based SaaS analytics platform that streamlines data analytics by integrating multiple workloads into one comprehensive solution. Fabric covers a wide range of areas, including data ingestion, data warehousing, and data engineering, and represents a bold step toward the future of data analytics.

Previously, Microsoft's data analytics tools—Data Factory, Synapse, Power BI, Purview, and others—operated as individual services. That meant users had to set up, pay for, and connect to each tool individually. Such an approach complicated the end-to-end data process and increased costs. Microsoft Fabric, however, offers a strategic solution by combining these services into one integrated system, providing a more user-friendly and cost-effective solution. It provides a comprehensive range of fully integrated analytical experiences, each tailored to a unique task and user profile and addressing an end-to-end analytical requirement. Data Engineering, Azure Data Factory, Data Science, Data Warehouse, Real-Time Analytics, and Power BI are all included.

## An overview of the core features

Microsoft Fabric can be seen as an all-in-one platform that gathers all of the necessary components for data analysis and is developed with various user roles in mind. It consists of several components, all of which are designed to make dealing with data easier. Microsoft has added Azure Data Factory in Fabric as a connector, bringing information from over 200 different places together in a simple and powerful way.

While Fabric's Data Warehouse functions as a sizable storage facility that houses all of your data efficiently and conveniently, Fabric's Data Science component, which is completely integrated with Azure Machine Learning, functions like a science lab for tech specialists to develop and deploy their data prediction models. Also available are real-time analytics and Power BI, a user-friendly tool for data visualization that enables anybody to access, comprehend, and base decisions on data. Last but not least we have Microsoft Fabric Spark integration with Data Factory which enables the scheduling and orchestration of Spark notebooks and jobs.

Let's take a closer look at some of Microsoft Fabric's standout features and have a quick debate on whether you should switch over immediately to this cutting-edge new data and analytics platform from Microsoft.

![Microsoft Fabric Overview](/fabric_ml.webp)

## Storing and managing data with OneLake

OneLake, a layer that lies above Azure Data Lake Storage Gen-2, is a fundamental component of Fabric. It transforms data lake management by consolidating several storage accounts from many geographical regions into a single user-friendly layer. Furthermore, whenever a new workspace is created, OneLake immediately establishes a new storage area within the existing Data Lake, ensuring easy access, speed, and compliance with data governance rules.

OneLake is a Fabric component that simplifies how organizations store and retrieve data. Consider it a gigantic virtual filing cabinet that consolidates data from various locations into a single, easily accessible location. This makes finding and using data easier while also keeping it secure.

## Improved collaboration with Workspaces

Fabric's use of workspaces, which might be familiar to you from Power BI, operating as a centralized access point within Fabric, is one of its notable features. These workspaces provide secure, specialized areas for certain groups to store, distribute, and manage data and project components, which are referred to as "artifacts." This novel solution allows several users to collaborate inside the same workspace while using the same data, without the requirement for data duplication or relocation between environments or cloud services.

Fabric workspaces are similar to digital rooms where teams may store and share data. They're similar to the shared folders that many of us use every day, but they're built to manage large amounts of data and give teams more control over who can access them.

## Keeping your data secure with OneSecurity

OneSecurity, a Fabric security feature, delivers full workspace-level security that integrates seamlessly with Power BI. Governance and compliance measures are already built into Azure Data Lake Storage and Power BI. Furthermore, Microsoft's Purview is intended to support Fabric's governance and compliance.

Simply defined, OneSecurity is a Fabric feature that aids in data security. It operates in the background to guarantee that only authorized users have access to the data they require. This capability, combined with Microsoft's robust data governance and compliance policies and tools, helps keep your data safe and secure.

## An overview of pricing and licenses

In terms of pricing and licensing, Microsoft is following the Power BI Premium strategy with a capacity licensing model for Fabric. Customers buy Fabric Quality Units (FQUs), which give a common degree of performance capacity for all tools. Although this strategy is adaptable, details concerning scaling remain unknown. Furthermore, the licensing restrictions for Power BI continue to apply within Fabric.

In a way, Fabric employs a 'pay for what you use' model. Customers purchase 'units' of capacity, which govern how much work they may perform on the platform. However, the pricing details are a little complicated, and Microsoft hasn't provided all of them yet. However, businesses may find it more cost-effective than the alternatives, if they utilize it wisely and take advantage of its capacity to simplify.

## Should I move my data architecture to Microsoft Fabric?

With the release of Fabric, existing customers of Microsoft's data analytics products may question the need for migration. While immediate migration is not required, Microsoft's emphasis on Fabric indicates that it may become the preferred approach in the future. Current Power BI customers will likely find the transfer easiest, as enabling Fabric provides instant access to powerful capabilities such as Synapse Analytics, Data Science, and Data Engineering services.

So, if you're already utilizing Microsoft's data tools, you might be wondering if you need to migrate to Fabric. The quick answer is no, not right away. Microsoft has stated that it will continue to support earlier technologies, but it is focusing more on Fabric, implying that it may become the primary way to handle data in the future.

Another thing to consider, just like any other SaaS offering, is that it’s cloud-based. If you are still using on-premises architectures due to legal, compliance, or just internal decisions, keep in mind the cost and effort of moving to the cloud.

At Monstarlab, we have a specialized data and analytics team ready to support you on all types of investments you might be considering, being just a simple discovery use case, a cloud migration one, or a lift and shift from your existing Azure-based data architecture to a new Microsoft Fabric based one.

Thank you,
Rui Machado
