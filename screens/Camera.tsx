import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from "expo-file-system";
import mediaApi from '../api/media/mediaApi';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null); // Cmachado: dado da Face detectada pela camera, inicializa o estado da imagem como null para não aparecer a imagem padrão
  const [cameraRef, setCameraRef] = useState<string | null | any>(null); // Cmachado: altera o estado da cameraRef para null para permitir que a camera seja inicializada apenas uma vez
  const [faceDir, setFaceDir] = useState<string | null>(null); // Cmachado: inicializa o estado do diretório como null para criar o diretório apenas uma vez
  const [faceImage, setFaceImage] = useState<string | null>(null); // Cmachado: inicializa o estado da imagem como null para não aparecer a imagem padrão
  const [waitingApiResponse, setwaitingApiResponse] = useState<any>(false);

  const [ addMedia, { data, error, isError, isLoading }] = mediaApi.useAddMediaMutation();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
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
    formData.append('data', localUri);

    let r = await addMedia({
        formData,   
    })
    console.log("r", r)

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
        if(faceDir) {
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
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
