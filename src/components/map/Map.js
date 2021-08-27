/*global kakao*/
import React, { useCallback, useEffect } from 'react';
import MarkerImg from './MarkerImg.svg';

export default function Map(props) {
    const { storeList, selectStore } = props;
    
    const mapScript = useCallback(() => {
        const selected = storeList.find(item => item.shop_id === selectStore);
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(
                selected !== undefined && selected !== null
                    ? parseFloat(selected.shop_lat)
                    : 37.56483273504566,
                    selected !== undefined && selected !== null
                    ? parseFloat(selected.shop_lng)
                    : 126.97722666394488,
            ),
            level: 5,
        };
        const map = new kakao.maps.Map(container, options);
        const geocoder = new kakao.maps.services.Geocoder();

        const imageSrc = MarkerImg,
            imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
            imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        const markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption,
        );

        const marker = new kakao.maps.Marker({
            position: map.getCenter(),
            image: markerImage,
        });
        // const ClickMarker = new kakao.maps.Marker({
        //     position: map.getCenter(),
        //     image: markerImage,
        // });
        storeList.forEach((el) => {
            // 마커를 생성합니다
            new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(
                    parseFloat(el.shop_lat),
                    parseFloat(el.shop_lng),
                ),
                //마커에 hover시 나타날 title
                title: el.shop_name,
                image: markerImage,
            });
            var infowindow = new kakao.maps.InfoWindow({
                content: el.shop_name, // 인포윈도우에 표시할 내용
            });

            // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
            // 이벤트 리스너로는 클로저를 만들어 등록합니다
            // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
            kakao.maps.event.addListener(
                marker,
                'mouseover',
                makeOverListener(map, marker, infowindow),
            );
            kakao.maps.event.addListener(
                marker,
                'mouseout',
                makeOutListener(infowindow),
            );
        });

        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
        function makeOverListener(map, marker, infowindow) {
            return function () {
                infowindow.open(map, marker);
            };
        }

        // 인포윈도우를 닫는 클로저를 만드는 함수입니다
        function makeOutListener(infowindow) {
            return function () {
                infowindow.close();
            };
        }

        // const infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다
        
        // function searchDetailAddrFromCoords(coords, callback) {
        //     // 좌표로 법정동 상세 주소 정보를 요청합니다
        //     geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        // }

        /* 단일 마커 표시 */
    }, [selectStore, storeList]);

    useEffect(() => {
        mapScript();
    }, [mapScript]);

    return <div id="map" style={{ width: '100%', height: '560px' }}></div>;
}
