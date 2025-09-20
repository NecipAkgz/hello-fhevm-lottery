import { ethers } from "ethers";

async function main() {
  console.log("🎯 Contract deployment başlatılıyor...");

  try {
    // Ethers provider oluştur
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner();

    console.log("✅ Provider ve signer oluşturuldu");

    // Contract bytecode'ını oku (compile edilmiş contract'tan)
    const fs = await import("fs");
    const contractData = JSON.parse(fs.readFileSync("./artifacts/contracts/ConfidentialLottery.sol/ConfidentialLottery.json", "utf8"));

    console.log("✅ Contract ABI ve bytecode yüklendi");

    // Contract factory oluştur
    const ConfidentialLottery = new ethers.ContractFactory(contractData.abi, contractData.bytecode, signer);
    console.log("✅ Contract factory oluşturuldu");

    // Contract deploy et
    const lottery = await ConfidentialLottery.deploy();
    console.log("🚀 Contract deployment başladı...");

    // Deployment tamamlanmasını bekle
    await lottery.waitForDeployment();
    console.log("✅ Contract deployment tamamlandı");

    // Contract adresini al
    const address = await lottery.getAddress();
    console.log("📍 Contract adresi:", address);
    console.log("💰 Bilet fiyatı:", ethers.formatEther(await lottery.ticketPrice()), "ETH");

    // Deployment bilgilerini kaydet
    const deploymentInfo = {
      contractAddress: address,
      deployer: await signer.getAddress(),
      network: "localhost",
      deploymentTime: new Date().toISOString(),
      ticketPrice: ethers.formatEther(await lottery.ticketPrice())
    };

    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment bilgileri 'deployment-info.json' dosyasına kaydedildi");

    console.log("\n🎉 Contract başarıyla deploy edildi!");
    console.log("🔗 Frontend'de bu adresi kullanın:", address);

    return address;

  } catch (error) {
    console.error("❌ Deployment hatası:", error);
    process.exit(1);
  }
}

main();
