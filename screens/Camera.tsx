import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import mediaApi from "../api/media/mediaApi";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null); // Cmachado: dado da Face detectada pela camera, inicializa o estado da imagem como null para não aparecer a imagem padrão
  const [cameraRef, setCameraRef] = useState<string | null | any>(null); // Cmachado: altera o estado da cameraRef para null para permitir que a camera seja inicializada apenas uma vez
  const [faceDir, setFaceDir] = useState<string | null>(null); // Cmachado: inicializa o estado do diretório como null para criar o diretório apenas uma vez
  const [faceImage, setFaceImage] = useState<string | null>(null); // Cmachado: inicializa o estado da imagem como null para não aparecer a imagem padrão
  const [waitingApiResponse, setwaitingApiResponse] = useState<any>(false);

  const [addMedia, { data, error, isError, isLoading }] =
    mediaApi.useAddMediaMutation();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    console.log("takePicture()");
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      // Renderiza a imagem tirada pela camera por 3 segundos
      setImage(photo.uri); // Cmachado: altera o source para a imagem que foi tirada
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // Salva a imagem no diretório criado com o nome de image.jpg
      if (faceDir !== null) {
        // Cmachado: verifica se o diretório já foi criado para não criar novamente
        const dirInfo = await FileSystem.getInfoAsync(faceDir);
        console.log("dirInfo  ", dirInfo.exists);
        await saveImage(photo);
      } else {
        await createDirectory();
        await saveImage(photo); // Cmachado: salva a imagem no diretório criado anteriormente
      }
    }
  }

  async function uploadImage() {
    console.log("uploadImage()");
    const apiUri = "http://192.168.0.33:7000/upload";
    const uri = faceImage;
    let localUri = uri;
    let filename = localUri ? localUri.split("/").pop() : "";
    console.log("enviando para api: " + filename);

    const formData = new FormData();
    formData.append("data", localUri);
    let img = FileSystem.readAsStringAsync(localUri);

    const file: string = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const form = new FormData();
    // form.append('image_url', 'https://spyne-prod-tech.s3.amazonaws.com/fGD1VC1So/TJgk9lIE/02d374d9674c4d5abb730485cb6d8380/75a6d8bf7a77457c/images/input/hres_I2IXTXOCWE_75a6d8bf7a77457c_Exterior_1.jpg');
    form.append("image_file", file);

    // console.log("64", file );
    form.append("car_classifier", "true");
    form.append("car_type_classifier", "true");
    form.append("car_shoot_category", "true");
    form.append("car_interior_category", "true");
    form.append("angle_detection", "true");
    form.append("crop_detection", "true");
    form.append("distance_detection", "true");
    form.append("exposure_detection", "true");
    form.append("reflection_detection", "true");
    form.append("tilt_detection", "true");
    form.append("window_tint_detection", "true");
    form.append("tyre_mud_detection", "true");
    form.append("number_plate_detection", "true");

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: "Bearer bf3154da-cf31-4d61-bdee-ad3e1a74a5d4",
      },
    };

    // const fetch = require('node-fetch');
    // options.body = form;
    // fetch('https://api.spyne.ai/auto/classify/v1/image', options)
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(err => console.error(err));

    // let r = await addMedia({
    //     file,
    // })

    // await newFunction();

    //   async function newFunction() {
    //       try {
    //           if (localUri) {
    //               // Cmachado: verifica se a uri não está vazia para fazer o upload
    //               addMedia({
    //                   filename,
    //               });
    //               // const response = await FileSystem.uploadAsync(apiUri, localUri, {
    //               //     fieldName: "file",
    //               //     httpMethod: "POST",
    //               //     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    //               //     mimeType: "multipart/form-data",
    //               //     parameters: {
    //               //         boundaryString: "---011000010111000001101001",
    //               //     },
    //               // });
    //               // console.log("Response", response.body);
    //               // let cpf = response.body.slice(44, 56);
    //               // console.log("cpf", cpf);
    //               await FileSystem.deleteAsync(localUri)
    //                   .then(() => {
    //                       console.log("Arquivo deletado com sucesso");
    //                   })
    //                   .catch((error) => {
    //                       console.error("Erro ao deletar o arquivo:", error);
    //                   });
    //               // if (cpf) {
    //               //     setTimeout(() => {
    //               //         setwaitingApiResponse(false);
    //               //     }, 2000);
    //               // } else {
    //               //     setwaitingApiResponse(false);
    //               // }
    //           }
    //       } catch (error) {
    //           console.error(error);
    //           setwaitingApiResponse(false);
    //       }
    //   }
    ins();
  }

  async function ins() {
    const fetch = require("node-fetch");

    let url = "https://www.lavaggioapp.it/wp-json/wp/v2/media";

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5sYXZhZ2dpb2FwcC5pdCIsImlhdCI6MTcyMjE4NTM4MiwibmJmIjoxNzIyMTg1MzgyLCJleHAiOjE3MjI3OTAxODIsImRhdGEiOnsidXNlciI6eyJpZCI6IjE4OSJ9fX0.RY52qyVoN2Ne_6EAudy-3Db0F7nR4qdqQZQhkP2xB5A",
        "Content-Disposition": 'attachment; filename="test_funn2y.jpg"',
        Accept: "application/json",
        cookie: "PHPSESSID=efl5pir6pnfu61349l1p22ib7b; ",
        "cache-control": "no-cache",
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error("error:" + err));
  }
  async function createDirectory() {
    console.log("createDirectory()");
    const dir = FileSystem.documentDirectory + "vehicle/"; // Cmachado: cria o diretório para salvar a imagem com o nome de faceDetected

    try {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      console.log("Diretório criado!");
      setFaceDir(dir);
    } catch (error) {
      console.error("Erro ao criar o diretório:", error);
      setFaceDir(null);
    }
  }

  async function saveImage(cameraRef: any) {
    console.log("saveImage()");
    if (cameraRef) {
      let photo = cameraRef;
      console.log("photo.uri: ", photo.uri);

      const newFileUri = `${faceDir}/image.jpg`;
      if (faceDir) {
        //como a função de criar diretório é assíncrona, aqui o código chega antes do diretório ser criado
        try {
          await FileSystem.moveAsync({
            from: photo.uri,
            to: newFileUri,
          });
          setFaceImage(newFileUri);
          console.log("Imagem salva!");
        } catch (error) {
          console.error("Erro ao salvar a imagem:", error);
        }
      }
    }
    if (faceImage !== null) {
      await uploadImage();
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Button onPress={takePicture} title="Capturar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
